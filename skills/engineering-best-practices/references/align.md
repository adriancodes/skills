# Align an Existing Codebase

Use this workflow only for an explicit request to assess a codebase's engineering direction or refactor it toward selected paradigms and patterns.

## 1. Frame the assessment

Clarify the intended outcome and scope from the request: easier feature delivery, safer changes, clearer ownership, fewer production failures, improved testing, or another observable result. Do not treat pattern adoption as the goal by itself.

Inspect representative end-to-end paths, dependency boundaries, state ownership, integration points, tests, and recent areas of change. Sample broadly enough to distinguish a system pattern from a local anomaly.

Framing is complete when the observable outcome, scope, and representative sample are explicit.

## 2. Build an evidence map

Classify observed approaches:

- **coherent** — repeated, internally consistent, supported, and safe enough to preserve;
- **harmful** — repeated but linked to concrete correctness, security, reliability, operability, or changeability problems;
- **accidental** — isolated, inconsistent, or unsupported;
- **missing** — a boundary or policy is implicit where an explicit decision would materially help.

Tie every important claim to code locations, tests, dependency evidence, or observed change friction. Absence of a fashionable pattern is not a finding.

The evidence map is complete when every important classification cites repository evidence and covers the representative sample.

## 3. Retrieve relevant practices

Query the catalog using the observed problems and desired outcomes. Select a small set that explains the most important leverage points. Use source principle IDs for attribution, but translate each result into a repository-specific implication.

Retrieval is complete when every retained practice explains a demonstrated leverage point and has a repository-specific implication.

## 4. Recommend target directions

Offer two or three coherent target directions through the question contract, recommended first. Each direction should specify:

- boundaries, ownership, and dependency direction;
- patterns to preserve, introduce, retire, or contain;
- effects on state, integration failures, and testing;
- migration cost and principal risks;
- evidence that would trigger reconsideration.

Prefer convergence around existing strengths when possible. Recommend a named paradigm or pattern only when it directly addresses demonstrated pressure.

Iterate on the recommendation until accepted. When recommended defaults are delegated, select the simplest direction that resolves the demonstrated problems without speculative infrastructure.

Recommendation is complete when one coherent target direction is accepted or covered by default delegation.

## 5. Record the target

Create or update `docs/engineering-practices.md` using the bundled template. Clearly separate:

- current coherent patterns to preserve;
- the approved target direction;
- migration rules and temporary exceptions;
- source practices and local interpretations;
- reconsideration triggers.

Add or update the marked `AGENTS.md` pointer while preserving unrelated content.

Recording is complete when the charter separates current strengths, target direction, migration rules, exceptions, attribution, and reconsideration triggers, and the pointer preserves unrelated instructions.

## 6. Plan an incremental migration

Sequence behavior-preserving vertical slices. Each slice should:

1. protect the current behavior with tests or characterization;
2. establish one useful boundary or migrate one end-to-end path;
3. keep the system deployable and avoid dual abstractions lasting longer than necessary;
4. verify the claimed improvement;
5. update exceptions or progress in the charter when durable guidance changes.

Avoid bulk rewrites and layer-by-layer migrations that deliver no independently useful result. For substantial work, use the repository's specialized refactor-planning and implementation workflow when available.

Planning is complete when every slice is independently useful, behavior-preserving, verifiable, deployable, and ordered by explicit dependencies.

## 7. Review convergence

After each slice, check whether the target direction still fits the evidence. Preserve useful local variation when uniformity would add ceremony without reducing risk or change cost. Escalate contradictions instead of hiding them behind adapters.

Convergence review is complete when the slice's claimed improvement is verified and any contradiction, exception, or charter change is recorded.
