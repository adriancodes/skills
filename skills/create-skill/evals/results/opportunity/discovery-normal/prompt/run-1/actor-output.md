I’m using the skill-creator guidance because this request is explicitly about deciding whether and how to create a reusable skill. I’ll first apply its discovery test, then only scaffold a skill if the evidence clears that bar.

The discovery bar is the key constraint here: a generic diagnosis workflow has no company-specific knowledge, tool integration, deterministic script, or reusable artifact that a skill can uniquely provide. I’m checking whether any repository context changes that; if not, the fair comparison is the same diagnostic instructions packaged as a skill versus as a prompt.

The workspace is truly empty, so there is no local stack, incident schema, debugger integration, or recurring executable procedure to bundle. The comparison therefore does not support creating a skill: packaging identical instructions in `SKILL.md` adds trigger/context overhead but no diagnostic capability. I’m preserving the cheaper production-ready prompt and a falsifiable decision record, including the conditions that would justify upgrading it to a skill later.

A reusable skill did not clear the material-outperformance bar, so I implemented the cheaper mechanism: a concise, production-ready diagnosis prompt.

Artifacts:

- [DIAGNOSE_BUG_PROMPT.md](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-normal-prompt-work-y1V2M6/DIAGNOSE_BUG_PROMPT.md) — evidence-driven debugging workflow.
- [MECHANISM_DECISION.md](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-normal-prompt-work-y1V2M6/MECHANISM_DECISION.md) — comparison, scenario coverage test, limitations, and future upgrade criteria.

The repository contains no stack-specific knowledge, repeated executable workflow, integration, or diagnostic assets to bundle. A skill would therefore contain substantially the same 250-word instructions while adding triggering and maintenance overhead.

The prompt was checked for coverage across concurrency, production-only configuration, distant data corruption, and misleading-change scenarios. The decision record also defines when a real skill would become justified.