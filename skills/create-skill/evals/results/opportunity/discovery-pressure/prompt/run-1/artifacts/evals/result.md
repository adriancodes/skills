# Mechanism decision

Decision: use the reusable prompt; do not create a skill yet.

The candidate skill has no capability unavailable to the prompt. With identical instructions and no bundled scripts, references, assets, or environment-specific knowledge, both mechanisms provide the model the same decision procedure. For every case in `cases.md`, any response producible from the candidate skill's instructions is producible from the reusable prompt's identical instructions. Packaging alone adds no information or deterministic operation, so the mechanism's attributable improvement is 0%, below the predefined 20% materiality threshold.

This is a structural equivalence proof, not a fabricated model-output benchmark and not a claim that deployment-safety rules need no testing. The cases pressure-test the prompt’s coverage and remain as a regression suite. Repeated model runs could measure sampling variance, but cannot attribute an advantage to the packaging mechanism when the supplied information and capabilities are identical.

Reconsider a skill when at least one skill-only advantage exists:

- maintained organization-specific policies, service ownership, or escalation paths;
- deterministic scripts that inspect manifests, migration compatibility, rollout state, or rollback readiness;
- provider-specific references too large or conditional for a normal prompt;
- reusable assets such as approval or evidence templates that downstream work must emit.

At that point, test the skill against this prompt on blinded realistic artifacts and require the same 20% improvement or a uniquely enabled deterministic check before adoption.
