#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const self = fileURLToPath(import.meta.url);
const phase = process.argv[2] ?? "pilot";
const matrix = JSON.parse(fs.readFileSync(path.join(root, "matrix.json"), "utf8"));
const suite = JSON.parse(fs.readFileSync(path.join(root, "suite-manifest.json"), "utf8"));
const caseFiles = [path.join(root, "cases.jsonl"), path.join(root, `probe-cases-${phase}.jsonl`)].filter((file) => fs.existsSync(file));
const caseItems = caseFiles.flatMap((file) =>
  fs
    .readFileSync(file, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line)),
);
const cases = new Map(caseItems.map((item) => [item.id, item]));

function findInputs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return findInputs(target);
    return entry.name === "score-input.json" ? [target] : [];
  });
}

function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function completeCell(cell) {
  const base = ["harness", "harness_version", "model", "launch_command", "install_command", "force_load_command"].every(
    (key) => typeof cell[key] === "string" && cell[key].length > 0,
  );
  const pinned = typeof cell.model_snapshot === "string" && cell.model_snapshot.length > 0;
  const opaque =
    cell.model_snapshot === null &&
    cell.snapshot_policy === "opaque-time-bounded" &&
    typeof cell.auth_route === "string" &&
    cell.auth_route.length > 0 &&
    typeof cell.observed_at === "string" &&
    !Number.isNaN(Date.parse(cell.observed_at));
  return base && (pinned || opaque);
}

function evidenceExists(runFile, relativePath) {
  if (typeof relativePath !== "string") return false;
  const base = fs.realpathSync(path.dirname(runFile));
  const candidate = path.resolve(base, relativePath);
  if (!fs.existsSync(candidate)) return false;
  const real = fs.realpathSync(candidate);
  return real === base || real.startsWith(`${base}${path.sep}`);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function containedHash(base, evidence) {
  if (!evidence || typeof evidence.path !== "string" || typeof evidence.sha256 !== "string") return false;
  const resolvedBase = path.resolve(base);
  const target = path.resolve(root, evidence.path);
  if (!target.startsWith(`${resolvedBase}${path.sep}`) || !fs.existsSync(target)) return false;
  const realBase = fs.realpathSync(resolvedBase);
  const realTarget = fs.realpathSync(target);
  return realTarget.startsWith(`${realBase}${path.sep}`) && sha256(realTarget) === evidence.sha256;
}

function inventoryHash() {
  const excluded = new Set(["suite-manifest.json", "probe-cases-pilot.jsonl", "probe-cases-expansion.jsonl"]);
  function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const target = path.join(dir, entry.name);
      const relative = path.relative(root, target);
      if (relative === "results" || relative.startsWith(`results${path.sep}`)) return [];
      if (entry.isDirectory()) return walk(target);
      return excluded.has(relative) ? [] : [relative];
    });
  }
  const inventory = walk(root)
    .sort()
    .map((relative) => `${relative}\0${sha256(path.join(root, relative))}`)
    .join("\n");
  return crypto.createHash("sha256").update(inventory).digest("hex");
}

if (phase === "--inventory") {
  console.log(inventoryHash());
  process.exit(0);
}

const blockers = [];
if (cases.size !== caseItems.length) blockers.push("duplicate case IDs across known and probe suites");
const policy = matrix[phase];
if (!policy) blockers.push(`unknown matrix phase: ${phase}`);
if (matrix.status !== "FROZEN") blockers.push("matrix status is not FROZEN");
if (policy && !policy.cells.every(completeCell)) blockers.push(`${phase} matrix contains unresolved cell fields`);
if (suite.status !== "FROZEN") blockers.push("suite manifest is not FROZEN");
const frozenAt = Date.parse(suite.frozen_at);
if (suite.status === "FROZEN" && (typeof suite.frozen_at !== "string" || Number.isNaN(frozenAt))) {
  blockers.push("frozen suite requires a valid frozen_at timestamp");
}
if (suite.suite_version !== matrix.suite_version) blockers.push("suite and matrix versions differ");
if (!Array.isArray(suite.opportunity_evidence) || suite.opportunity_evidence.length === 0) {
  blockers.push("suite manifest lacks opportunity evidence");
} else {
  const opportunityRoot = path.resolve(root, "results", "opportunity");
  const discoveryCases = [...cases.values()].filter((item) => item.split === "discovery");
  for (const testCase of discoveryCases) {
    for (const arm of ["none", "prompt"]) {
      const entries = suite.opportunity_evidence.filter((entry) => entry.case_id === testCase.id && entry.arm === arm);
      if (entries.length !== 1) blockers.push(`${testCase.id}/${arm}: expected one opportunity entry, found ${entries.length}`);
    }
  }
  for (const entry of suite.opportunity_evidence) {
    const discoveryCase = cases.get(entry.case_id);
    if (!new Set(["none", "prompt"]).has(entry.arm) || discoveryCase?.split !== "discovery") blockers.push("invalid opportunity case or arm");
    if (!containedHash(opportunityRoot, entry.output) || !containedHash(opportunityRoot, entry.tool_trace)) {
      blockers.push(`${entry.case_id}/${entry.arm}: invalid output or tool-trace evidence`);
    }
    for (const artifact of entry.artifacts ?? []) if (!containedHash(opportunityRoot, artifact)) blockers.push(`${entry.case_id}/${entry.arm}: invalid artifact evidence`);
    if (!Number.isInteger(entry.tokens) || entry.tokens < 0 || !Number.isInteger(entry.actor_sessions) || entry.actor_sessions < 1) {
      blockers.push(`${entry.case_id}/${entry.arm}: invalid opportunity usage`);
    }
    const expected = new Map((discoveryCase?.assertions ?? []).map((assertion) => [assertion.id, assertion]));
    if (!entry.assertions || typeof entry.assertions !== "object") blockers.push(`${entry.case_id}/${entry.arm}: missing scored assertions`);
    for (const id of expected.keys()) if (!(id in (entry.assertions ?? {}))) blockers.push(`${entry.case_id}/${entry.arm}: missing assertion ${id}`);
    for (const [id, result] of Object.entries(entry.assertions ?? {})) {
      if (!expected.has(id)) blockers.push(`${entry.case_id}/${entry.arm}: unknown assertion ${id}`);
      if (!new Set([0, 1]).has(result?.score)) blockers.push(`${entry.case_id}/${entry.arm}/${id}: score must be 0 or 1`);
      if (result?.method !== "blinded-judge") blockers.push(`${entry.case_id}/${entry.arm}/${id}: discovery assertions require blinded-judge scoring`);
      if (!Array.isArray(result?.evidence) || result.evidence.length === 0 || !result.evidence.every((item) => containedHash(opportunityRoot, item))) {
        blockers.push(`${entry.case_id}/${entry.arm}/${id}: invalid assertion evidence`);
      }
      if (result?.method === "blinded-judge") {
        if (!containedHash(opportunityRoot, result.judge_prompt) || !containedHash(opportunityRoot, result.judge_output)) {
          blockers.push(`${entry.case_id}/${entry.arm}/${id}: invalid blinded-judge provenance`);
        } else {
          const judge = JSON.parse(fs.readFileSync(path.resolve(root, result.judge_output.path), "utf8"));
          const judgeScore = judge.score ?? judge.scores?.[id];
          if (judgeScore !== result.score) blockers.push(`${entry.case_id}/${entry.arm}/${id}: score contradicts blinded-judge output`);
        }
      }
    }
  }
  const decision = suite.opportunity_decision;
  if (decision?.decision !== "PROTOTYPE" || !Array.isArray(decision.residual_assertion_ids) || decision.residual_assertion_ids.length === 0) {
    blockers.push("effectiveness scoring requires a PROTOTYPE opportunity decision with residual prompt failures");
  } else {
    const failedPromptAssertions = new Set(
      suite.opportunity_evidence
        .filter((entry) => entry.arm === "prompt")
        .flatMap((entry) => Object.entries(entry.assertions ?? {}).filter(([, result]) => result.score === 0).map(([id]) => id)),
    );
    for (const id of decision.residual_assertion_ids) {
      if (!failedPromptAssertions.has(id)) blockers.push(`opportunity residual ${id} is not a scored prompt-arm failure`);
    }
    if (!containedHash(opportunityRoot, decision.rationale)) blockers.push("opportunity decision lacks hashed rationale evidence");
  }
}
if (suite.status === "FROZEN" && suite.inventory_sha256 !== inventoryHash()) blockers.push("frozen suite inventory hash mismatch");
if (phase === "expansion") {
  const pilotVerdictFile = path.join(root, "results", "pilot-verdict.json");
  const recomputed = spawnSync(process.execPath, [self, "pilot"], { encoding: "utf8" });
  if (recomputed.status !== 0) blockers.push("expansion requires a currently passing pilot recomputed from raw inputs");
  else if (!fs.existsSync(pilotVerdictFile)) blockers.push("expansion requires results/pilot-verdict.json");
  else {
    const preserved = JSON.parse(fs.readFileSync(pilotVerdictFile, "utf8"));
    const current = JSON.parse(recomputed.stdout);
    if (JSON.stringify(preserved) !== JSON.stringify(current)) blockers.push("preserved pilot verdict differs from recomputed pilot result");
  }
}

const rawRuns = findInputs(path.join(root, "results")).map((file) => ({ file, data: JSON.parse(fs.readFileSync(file, "utf8")) }));
const runs = [];
const uniqueRuns = new Set();

for (const { file, data: run } of rawRuns) {
  const required = [
    "schema_version",
    "suite_version",
    "matrix_phase",
    "case_id",
    "arm",
    "harness",
    "harness_version",
    "model",
    "model_snapshot",
    "iteration",
    "run_index",
    "started_at",
    "assertions",
    "tokens",
    "latency_ms",
    "tool_calls",
    "actor_sessions",
  ];
  for (const key of required) if (!(key in run)) blockers.push(`${file}: missing ${key}`);
  if (run.schema_version !== 1) blockers.push(`${file}: unsupported schema_version`);
  if (run.suite_version !== matrix.suite_version) blockers.push(`${file}: suite_version mismatch`);
  if (run.matrix_phase !== phase) continue;
  if (Number.isNaN(Date.parse(run.started_at))) blockers.push(`${file}: invalid started_at`);
  if (!Number.isNaN(frozenAt) && Date.parse(run.started_at) <= frozenAt) blockers.push(`${file}: run did not start after suite freeze`);
  const testCase = cases.get(run.case_id);
  if (!testCase) {
    blockers.push(`${file}: unknown case_id ${run.case_id}`);
    continue;
  }
  if (
    !policy?.cells.some(
      (cell) =>
        cell.harness === run.harness &&
        cell.harness_version === run.harness_version &&
        cell.model === run.model &&
        cell.model_snapshot === run.model_snapshot,
    )
  ) {
    continue;
  }
  if (run.iteration !== matrix.scored_iteration) continue;
  const key = [run.harness, run.model, run.case_id, run.arm, run.run_index].join("|");
  if (uniqueRuns.has(key)) blockers.push(`${file}: duplicate run key ${key}`);
  uniqueRuns.add(key);

  if (testCase.kind === "trigger") {
    if (run.arm !== "trigger") blockers.push(`${file}: trigger case must use trigger arm`);
    if (typeof run.trigger_observed !== "string") blockers.push(`${file}: trigger_observed is required`);
  }
  const expected = new Map(testCase.assertions.map((assertion) => [assertion.id, assertion]));
  for (const id of expected.keys()) if (!(id in run.assertions)) blockers.push(`${file}: missing assertion ${id}`);
  for (const [id, result] of Object.entries(run.assertions ?? {})) {
    if (!expected.has(id)) blockers.push(`${file}: unknown assertion ${id}`);
    if (!result || !new Set([0, 1]).has(result.score)) blockers.push(`${file}: ${id} score must be 0 or 1`);
    if (!new Set(["mechanical", "blinded-judge"]).has(result?.method)) blockers.push(`${file}: ${id} has invalid method`);
    if (!Array.isArray(result?.evidence_paths) || result.evidence_paths.length === 0) blockers.push(`${file}: ${id} lacks evidence_paths`);
    for (const evidence of result?.evidence_paths ?? []) {
      const target = path.resolve(path.dirname(file), evidence.path ?? "");
      if (!evidenceExists(file, evidence.path) || typeof evidence.sha256 !== "string" || sha256(target) !== evidence.sha256) {
        blockers.push(`${file}: missing or changed evidence ${evidence.path}`);
      }
    }
    if (result?.method === "blinded-judge") {
      for (const judgePath of [result.judge_prompt_path, result.judge_output_path]) {
        if (
          typeof judgePath !== "string" ||
          !evidenceExists(file, judgePath) ||
          !(result.evidence_paths ?? []).some((evidence) => evidence.path === judgePath)
        ) {
          blockers.push(`${file}: ${id} lacks blinded-judge provenance`);
        }
      }
      if (typeof result.judge_output_path === "string" && evidenceExists(file, result.judge_output_path)) {
        const judge = JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), result.judge_output_path), "utf8"));
        if (judge.score !== result.score) blockers.push(`${file}: ${id} score contradicts blinded-judge output`);
      }
    }
    if (testCase.kind === "trigger" && expected.get(id)?.critical && result?.score === 0) blockers.push(`${file}: critical trigger assertion failed`);
  }
  if (testCase.kind === "trigger" && typeof run.trigger_observed === "string") {
    const correct = testCase.expected.startsWith("not-") ? run.trigger_observed !== "create-skill" : run.trigger_observed === testCase.expected;
    const assertionScore = run.assertions[testCase.assertions[0].id]?.score;
    if (assertionScore !== (correct ? 1 : 0)) blockers.push(`${file}: trigger assertion contradicts trigger_observed`);
  }
  if (testCase.kind !== "trigger") {
    if (!new Set(["prompt", "skill"]).has(run.arm)) blockers.push(`${file}: behavior case requires prompt or skill arm`);
  }
  if (![run.tokens, run.latency_ms, run.tool_calls].every((value) => Number.isInteger(value) && value >= 0)) {
    blockers.push(`${file}: usage fields must be nonnegative integers`);
  }
  if (!Number.isInteger(run.actor_sessions) || run.actor_sessions < 1) blockers.push(`${file}: actor_sessions must be >= 1`);
  runs.push({ ...run, file, testCase });
}

if (policy) {
  const heldout = [...cases.values()].filter((item) => item.split === "heldout");
  const triggers = [...cases.values()].filter((item) => item.kind === "trigger");
  for (const cell of policy.cells) {
    for (const testCase of heldout) {
      for (const arm of ["prompt", "skill"]) {
        const count = runs.filter((run) => run.harness === cell.harness && run.model === cell.model && run.case_id === testCase.id && run.arm === arm).length;
        if (count !== policy.behavior_repetitions) blockers.push(`${cell.harness}/${cell.model}/${testCase.id}/${arm}: expected ${policy.behavior_repetitions} runs, found ${count}`);
      }
    }
    for (const testCase of triggers) {
      const count = runs.filter((run) => run.harness === cell.harness && run.model === cell.model && run.case_id === testCase.id && run.arm === "trigger").length;
      if (count !== policy.trigger_repetitions) blockers.push(`${cell.harness}/${cell.model}/${testCase.id}/trigger: expected ${policy.trigger_repetitions} runs, found ${count}`);
    }
  }
}

const rate = (values) => (values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length);

function calculateMetrics(cellRuns) {
  const behavior = { prompt: [], skill: [] };
  let criticalSkillFailures = 0;
  for (const run of cellRuns.filter((item) => item.testCase.split === "heldout")) {
    for (const assertion of run.testCase.assertions) {
      const score = run.assertions[assertion.id]?.score;
      if (!assertion.critical) behavior[run.arm]?.push(score);
      if (run.arm === "skill" && assertion.critical && score === 0) criticalSkillFailures += 1;
    }
  }
  let triggerTp = 0;
  let triggerFn = 0;
  let triggerFp = 0;
  let triggerTn = 0;
  for (const run of cellRuns.filter((item) => item.testCase.kind === "trigger")) {
    const predicted = run.trigger_observed === "create-skill";
    const positive = run.testCase.expected === "create-skill";
    if (positive && predicted) triggerTp += 1;
    else if (positive) triggerFn += 1;
    else if (predicted) triggerFp += 1;
    else triggerTn += 1;
  }
  const promptRate = rate(behavior.prompt);
  const skillRate = rate(behavior.skill);
  const promptTokens = median(cellRuns.filter((run) => run.testCase.split === "heldout" && run.arm === "prompt").map((run) => run.tokens));
  const skillTokens = median(cellRuns.filter((run) => run.testCase.split === "heldout" && run.arm === "skill").map((run) => run.tokens));
  const cleanProbeRounds = new Set(
    cellRuns
      .filter((run) => run.testCase.split === "probe" && run.arm === "skill" && run.testCase.assertions.every((item) => run.assertions[item.id]?.score === 1))
      .map((run) => run.testCase.probe_round),
  ).size;
  return {
    prompt_noncritical_rate: promptRate,
    skill_noncritical_rate: skillRate,
    noncritical_delta: promptRate === null || skillRate === null ? null : skillRate - promptRate,
    critical_skill_failures: criticalSkillFailures,
    trigger_precision: triggerTp + triggerFp === 0 ? null : triggerTp / (triggerTp + triggerFp),
    trigger_recall: triggerTp + triggerFn === 0 ? null : triggerTp / (triggerTp + triggerFn),
    prompt_median_tokens: promptTokens,
    skill_median_tokens: skillTokens,
    median_token_ratio: promptTokens && skillTokens !== null ? skillTokens / promptTokens : null,
    clean_probe_rounds: cleanProbeRounds,
  };
}

const actorSessions = runs.reduce((sum, run) => sum + (run.actor_sessions ?? 0), 0);
const totalTokens = runs.reduce((sum, run) => sum + (run.tokens ?? 0), 0);

function digest(parts) {
  return crypto.createHash("sha256").update(parts.sort().join("\n")).digest("hex");
}

const probeCases = [...cases.values()].filter((item) => item.split === "probe").sort((a, b) => a.probe_round - b.probe_round);
const probeApprovalRoot = path.resolve(root, "results", "probes");
function probeContentHash(probe) {
  const content = {
    id: probe.id,
    split: probe.split,
    kind: probe.kind,
    setup: probe.setup,
    request: probe.request,
    assertions: probe.assertions,
    probe_round: probe.probe_round,
    created_at: probe.created_at,
    prior_sha256: probe.prior_sha256,
  };
  return crypto.createHash("sha256").update(JSON.stringify(content)).digest("hex");
}
for (const probe of probeCases) {
  if (
    probe.kind !== "behavior" ||
    typeof probe.id !== "string" ||
    typeof probe.setup !== "string" ||
    probe.setup.trim() === "" ||
    typeof probe.request !== "string" ||
    probe.request.trim() === "" ||
    !Array.isArray(probe.assertions) ||
    probe.assertions.length === 0 ||
    !probe.assertions.some((assertion) => assertion.critical === true && typeof assertion.criterion === "string" && assertion.criterion.trim() !== "")
  ) {
    blockers.push(`${probe.id ?? "unknown probe"}: probe requires reproducible setup plus at least one critical downstream assertion`);
  }
  if (!containedHash(probeApprovalRoot, probe.approval_prompt) || !containedHash(probeApprovalRoot, probe.approval_output)) {
    blockers.push(`${probe.id ?? "unknown probe"}: missing hashed blinded probe approval`);
  } else {
    const approval = JSON.parse(fs.readFileSync(path.resolve(root, probe.approval_output.path), "utf8"));
    const assertionIds = (probe.assertions ?? []).map((assertion) => assertion.id).sort();
    if (
      approval.approved !== true ||
      approval.case_id !== probe.id ||
      approval.probe_sha256 !== probeContentHash(probe) ||
      typeof approval.failure_class !== "string" ||
      approval.failure_class.trim() === "" ||
      typeof approval.expected_downstream_outcome !== "string" ||
      approval.expected_downstream_outcome.trim() === "" ||
      JSON.stringify([...(approval.assertion_ids ?? [])].sort()) !== JSON.stringify(assertionIds)
    ) {
      blockers.push(`${probe.id}: blinded approval does not bind a non-tautological downstream outcome and assertions`);
    }
  }
  if (!containedHash(probeApprovalRoot, probe.attempt_ledger)) {
    blockers.push(`${probe.id ?? "unknown probe"}: missing hashed append-only harness attempt ledger`);
  } else {
    const ledger = JSON.parse(fs.readFileSync(path.resolve(root, probe.attempt_ledger.path), "utf8"));
    let sourceLaunches = [];
    if (containedHash(probeApprovalRoot, ledger.source_evidence)) {
      const sourceFile = path.resolve(root, ledger.source_evidence.path);
      try {
        sourceLaunches = fs
          .readFileSync(sourceFile, "utf8")
          .trim()
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line))
          .filter((event) => event.event === "actor_session_started" && event.case_id === probe.id && event.matrix_phase === phase);
      } catch {
        blockers.push(`${probe.id}: harness source log is not canonical JSONL`);
      }
    }
    if (
      ledger.case_id !== probe.id ||
      ledger.matrix_phase !== phase ||
      ledger.complete !== true ||
      typeof ledger.append_only_source !== "string" ||
      ledger.append_only_source.trim() === "" ||
      !containedHash(probeApprovalRoot, ledger.source_evidence)
    ) {
      blockers.push(`${probe.id}: malformed harness attempt ledger`);
    } else if (policy) {
      for (const cell of policy.cells) {
        const launches = sourceLaunches.filter((launch) => launch.harness === cell.harness && launch.model === cell.model);
        const matchingRuns = runs.filter(
          (run) => run.harness === cell.harness && run.model === cell.model && run.testCase.id === probe.id && run.arm === "skill",
        );
        if (launches.length !== 1) blockers.push(`${cell.harness}/${cell.model}/${probe.id}: harness log records ${launches.length} launches`);
        if (
          launches.length === 1 &&
          (typeof launches[0].started_at !== "string" ||
            Number.isNaN(Date.parse(launches[0].started_at)) ||
            matchingRuns.length !== 1 ||
            launches[0].score_input_sha256 !== sha256(matchingRuns[0].file))
        ) {
          blockers.push(`${cell.harness}/${cell.model}/${probe.id}: harness launch does not bind the retained scored run`);
        }
      }
    }
  }
}
const knownSuiteDigest = digest(
  runs
    .filter((run) => run.testCase.split !== "probe")
    .map((run) => `${path.relative(root, run.file)}\0${sha256(run.file)}`),
);
const probeChain = { known_suite_sha256: knownSuiteDigest, round_1_sha256: null };
if (probeCases.length > 0) {
  if (probeCases.length > 2 || probeCases[0].probe_round !== 1) blockers.push("probe suite must begin at round 1 and contain at most two rounds");
  else {
    const [round1, round2] = probeCases;
    if (Number.isNaN(Date.parse(round1.created_at))) blockers.push("probe round 1 requires a valid created_at timestamp");
    if (round1.prior_sha256 !== knownSuiteDigest) blockers.push("probe round 1 is not chained to the known-suite results");
    const round1Digest = digest([
      JSON.stringify(round1),
      ...runs
        .filter((run) => run.testCase.id === round1.id)
        .map((run) => `${path.relative(root, run.file)}\0${sha256(run.file)}`),
    ]);
    probeChain.round_1_sha256 = round1Digest;
    if (round2) {
      if (round2.probe_round !== 2 || Number.isNaN(Date.parse(round2.created_at))) blockers.push("probe round 2 is malformed");
      if (Date.parse(round2.created_at) <= Date.parse(round1.created_at)) blockers.push("probe round 2 must be created after round 1");
      if (digest([round1.setup, round1.request]) === digest([round2.setup, round2.request])) blockers.push("probe rounds must use distinct content");
      if (round2.prior_sha256 !== round1Digest) blockers.push("probe round 2 is not chained to round-1 results");
    }
  }
}

const cellMetrics = {};
if (policy) {
  if (actorSessions > policy.max_actor_sessions) blockers.push(`actor-session budget exceeded: ${actorSessions}/${policy.max_actor_sessions}`);
  if (totalTokens > policy.max_tokens) blockers.push(`token budget exceeded: ${totalTokens}/${policy.max_tokens}`);
  for (const cell of policy.cells) {
    for (const probe of probeCases) {
      const attempts = runs.filter(
        (run) => run.harness === cell.harness && run.model === cell.model && run.testCase.id === probe.id && run.arm === "skill",
      );
      if (attempts.length !== 1) blockers.push(`${cell.harness}/${cell.model}/${probe.id}/skill: expected exactly one probe attempt, found ${attempts.length}`);
    }
    const label = `${cell.harness}/${cell.model}`;
    const metrics = calculateMetrics(runs.filter((run) => run.harness === cell.harness && run.model === cell.model));
    cellMetrics[label] = metrics;
    if (metrics.critical_skill_failures > 0) blockers.push(`${label}: ${metrics.critical_skill_failures} critical skill-arm failures`);
    if (metrics.noncritical_delta === null || metrics.noncritical_delta < policy.min_noncritical_delta) blockers.push(`${label}: noncritical delta below threshold`);
    if (metrics.trigger_precision === null || metrics.trigger_precision < policy.min_trigger_precision) blockers.push(`${label}: trigger precision below threshold`);
    if (metrics.trigger_recall === null || metrics.trigger_recall < policy.min_trigger_recall) blockers.push(`${label}: trigger recall below threshold`);
    if (metrics.median_token_ratio === null || metrics.median_token_ratio > policy.max_median_token_ratio) blockers.push(`${label}: median token ratio above threshold`);
    if (metrics.clean_probe_rounds < 2) blockers.push(`${label}: two clean fresh probe rounds required`);
  }
}

const budgetExpired = policy && (matrix.scored_iteration >= policy.max_iterations || actorSessions > policy.max_actor_sessions || totalTokens > policy.max_tokens);
const verdict = blockers.length === 0 ? "SHIP" : budgetExpired ? "ABANDON" : "ITERATE";
console.log(
  JSON.stringify(
    {
      suite_version: matrix.suite_version,
      phase,
      iteration: matrix.scored_iteration,
      verdict,
      metrics: {
        cells: cellMetrics,
        actor_sessions: actorSessions,
        total_tokens: totalTokens,
        probe_chain: probeChain,
      },
      blockers,
    },
    null,
    2,
  ),
);
process.exit(verdict === "SHIP" ? 0 : verdict === "ITERATE" ? 2 : 3);
