# Skill Validation Checklist

Run every item before finalizing a skill. A single "no" means the skill is not ready.

**Run with `references/rules.md` loaded.** Items below that concern word targets, description rules, required sections, the quality gate, or bulletproofing resolve their authoritative values from the rule registry — they are not restated here, so the gate and the rules can never disagree.

## Intent and Skill Brief

- [ ] Every item in `references/rules.md` (Confirmed Skill Brief) passed before scoping, opportunity testing, or drafting
- [ ] Interview questions were adaptive, asked one per turn, and used recommended-first multiple choice with a free-form path
- [ ] At least one post-invocation, decision-changing answer preceded the Skill Brief; the later confirmation question was not counted as the interview
- [ ] Any zero-question path records an explicit interview waiver plus the user's acceptance of every `ASSUMED` item; speed or “only necessary questions” was not treated as a waiver
- [ ] The user explicitly confirmed the restated Skill Brief, including every labeled assumption
- [ ] Scope and eval cases trace to confirmed use cases and success measures rather than an agent-invented interpretation

## Opportunity Test

- [ ] The Evaluation Tier in `references/rules.md` was chosen from consequence before testing; uncertainty selected the higher tier
- [ ] Every item in `references/rules.md` (Opportunity Test Requirements) passed before drafting, or current preserved evidence validly covers an existing-skill improvement
- [ ] The opportunity record identifies an observable behavioral residual or a confirmed delivery residual; otherwise the candidate stopped in favor of the cheaper mechanism
- [ ] Prompt-loaded output parity was not treated as automatic abandonment; total repeated-use utility includes instruction burden, autonomous recall, consistency, runtime cost, and collision risk
- [ ] Discovery cases are labeled and excluded from held-out scoring

## Structure

- [ ] Skill lives in its own directory: `skill-name/SKILL.md`
- [ ] SKILL.md has valid YAML frontmatter with `---` delimiters
- [ ] Frontmatter contains `name` and `description` fields; optional fields (`license`, `compatibility`, `metadata`, `allowed-tools`) appear only when applicable (`references/rules.md`, Frontmatter Fields)
- [ ] Name meets every rule in `references/rules.md` (Naming) — including the open-spec constraints: lowercase, 1–64 chars, no leading/trailing/consecutive hyphens, matches the parent directory name
- [ ] Every file referenced in SKILL.md body actually exists, via a relative path one level deep
- [ ] No empty directories (only create directories with content)
- [ ] If the `skills-ref` CLI is available, `skills-ref validate <skill-dir>` passes — a mechanical frontmatter/naming check; skip only when the tool is not installed

## Invocation

- [ ] The invocation axis was chosen deliberately in Phase 0 (`references/rules.md` → Invocation): model-invoked by default; user-invoked (`disable-model-invocation: true`) when the skill only fires by explicit request
- [ ] A user-invoked skill carries a one-line human-facing description — Description Quality below then does not apply

## Description Quality

- [ ] Every rule in `references/rules.md` (Description Rules) holds (model-invoked skills only)

## Body: Sections

- [ ] Every Required Section in `references/rules.md` (Required Sections) is present
- [ ] Each Conditional Section is present when its trigger applies (Required Context for pre-flight inputs; Tool Guidance for tool constraints; Additional Resources when references/, examples/, or scripts/ exist; Quick Reference for many options)

## Writing Style

- [ ] Imperative/infinitive voice throughout ("Parse the file", not "You should parse")
- [ ] No second person ("you", "your") anywhere in the body
- [ ] Objective, instructional language — focuses on WHAT to do, not WHO does it
- [ ] Bullet points and numbered steps, not dense paragraphs
- [ ] Code examples well-commented explaining WHY, not WHAT

## Behavioral Force

- [ ] All six levers in `references/rules.md` (Behavioral-Force Rules) hold: imperative force, positive specification, a load-bearing example, concrete anchors, front/end positioning, and leading words

## Steps and Pointers

- [ ] Every rule in `references/rules.md` (Steps and Pointers) holds — each workflow step ends on a checkable completion criterion, and each context pointer states when to load its target

## Pruning

- [ ] Every rule in `references/rules.md` (Pruning) holds — the sentence-level no-op pass was run, stale lines removed, each meaning lives in exactly one file

## Word Count

- [ ] SKILL.md body is within the word target for its skill type (`references/rules.md` → Word Targets)
- [ ] No SKILL.md body exceeds the hard cap (`references/rules.md` → Word Targets)
- [ ] Content beyond target moved to `references/`

## Progressive Disclosure

- [ ] Core concepts and essential workflow in SKILL.md
- [ ] Detailed patterns, schemas, API docs in `references/`
- [ ] Complete, runnable demonstrations in `examples/`
- [ ] Reusable utilities in `scripts/` (executable and documented)
- [ ] Output resources in `assets/` (templates, images, boilerplate)
- [ ] Every runtime supporting resource referenced explicitly in SKILL.md body; development-only `evals/` files remain outside runtime context

## Code Examples

- [ ] One excellent example per concept (not multi-language dilution)
- [ ] Examples are complete and runnable as-is
- [ ] Examples comment the WHY, not the WHAT
- [ ] Inline examples under 50 lines; longer examples in `examples/`
- [ ] No fill-in-the-blank templates; no contrived scenarios

## Discoverability (Keyword Optimization)

- [ ] Error messages and symptoms in "When to Use" section
- [ ] Synonyms for key concepts used throughout
- [ ] Tool names and CLI commands mentioned where relevant
- [ ] User-phrasing variations in description and body

## Cross-References

- [ ] Other skills referenced by name only (not file path)
- [ ] Required skills marked with "REQUIRED BACKGROUND:" prefix
- [ ] No `@` force-loading of external files
- [ ] Dependencies clearly stated as required vs. optional

## Bulletproofing (Discipline Skills Only)

- [ ] Every item in `references/rules.md` (Bulletproofing Requirements) is satisfied — including the final re-test after hardening

## Boundaries

- [ ] "Do Not Use When" section is present and specific
- [ ] Failure modes documented with clear escalation guidance
- [ ] Success criteria are measurable and unambiguous
- [ ] Skill scope is narrow — one job, not a whole profession

## Correctness Eval (Phase 7)

- [ ] Every item in `references/rules.md` (Eval Loop Requirements) is satisfied for the matching skill type and Evaluation Tier

## Comparative Effectiveness (Phase 8)

- [ ] Every item in `references/rules.md` (Comparative Effectiveness Requirements) is satisfied
- [ ] The skill's `evals/` package contains the evidence required by its tier: Tier 1 stays minimal, Tier 2 keeps a compact reproducible package, and Tier 3 carries the full frozen comparative machinery
- [ ] Tier 1 smoke behavior passes; Tier 2's paired value case improves the declared behavioral or delivery outcome and both skill-only regressions pass within the declared cost ceiling; Tier 3 passes its full comparison; triggering is tested to the tier required by any delivery claim
- [ ] Every failed iteration was shown to the user with ranked corrections; the selected correction was applied and the tier-required checks rerun within budget
- [ ] SHIP includes explicit user acceptance; user satisfaction never overrides failing evidence
- [ ] The final verdict is SHIP or ABANDON; ITERATE is never a shipping state

## Portability

- [ ] Every Portability rule in `references/rules.md` (Portability) holds — harness-specific tools named with a generic role + fallback, no hard harness-only dependency, runs as a plain instruction document

## Eight-Point Quality Gate

- [ ] All eight gates in `references/rules.md` (Quality Gate) answer "yes" — including #8 Evidence-appropriate, with the tier and claim scope stated

A single "no" means iterate. The registry notes the most commonly failed gate — #6, Self-consistent: skills that teach a structure they don't follow.
