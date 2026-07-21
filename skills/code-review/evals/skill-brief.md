# Confirmed Skill Brief: code-review

Confirmed by the user on 2026-07-18.

- **Problem:** Reviews drift into generic style commentary, miss specification violations and correctness risks, or report speculative findings.
- **Users:** Engineers reviewing branches, pull requests, commits, staged changes, or work in progress.
- **Core job:** Pin the exact diff, inspect changed code in context, and review it through correctness/regression, specification, and repository-standards lenses.
- **Output:** Findings first, ranked P0–P3. Every finding cites the changed location, states a realistic trigger and concrete consequence, and identifies supporting code, specification, or standards evidence.
- **Authority:** Read-only by default. Review does not authorize edits. When fixes were explicitly requested, complete the review first and apply only supported fixes afterward.
- **Base selection:** Honor a supplied base; otherwise infer the PR target, upstream, or default-branch merge base and state it.
- **Missing specification:** Continue with correctness and standards while marking Spec coverage unavailable.
- **Parallelism:** Use independent reviewers for substantial diffs when available; remain fully functional sequentially.
- **Triggers:** “review this branch,” “review this PR,” “review my changes,” “review since main,” pre-merge review, WIP diff review, and implementation-versus-spec review.
- **Non-triggers:** Current-code explanation, root-cause diagnosis, adversarial verification of a finished artifact, and implementation of a known change.
- **Success:** Actionable defects found, unsupported candidates removed, scope pinned, no nitpicks, no unauthorized edits, and honest residual-risk reporting.
- **Invocation:** Model-invoked.
- **Type:** Discipline.
- **Evidence:** Tier 2 is the eventual target because missed findings can waste reversible engineering work.
- **ASSUMED and accepted:** Launch no costly synthetic model sessions in this pass. Create and locally validate the strongest practical skill, label it as a candidate rather than a Tier-2 SHIP result, and improve it from real reviews.
