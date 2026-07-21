I’m using the skill-creator guidance because this request is specifically to build a reusable Codex skill. I’ll inspect its requirements, then scaffold and validate the diagnosis skill in this workspace.

The usage patterns are clear enough to proceed without blocking questions: intermittent failures, production-only regressions, concurrency bugs, performance pathologies, and unfamiliar-codebase defects. I’m structuring the skill around evidence preservation, hypothesis ranking, discriminating experiments, and a clear stop boundary between diagnosis and implementation.

The core skill is now written, with a compact main workflow and a separate playbook for concurrency, distributed, regression, performance, data, environment, and lifecycle failures. I’m doing the structural validation and a final trigger/metadata consistency check now.

The official validator is present but cannot start because its Python environment lacks the `yaml` module. I won’t install dependencies implicitly; I’ll run equivalent local checks with the available YAML parser and inspect the generated file set so validation still has concrete coverage.

Created the `diagnose-difficult-bugs` skill in the workspace.

Artifacts:

- [SKILL.md](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-normal-none-work-09BK3s/diagnose-difficult-bugs/SKILL.md)
- [failure-patterns.md](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-normal-none-work-09BK3s/diagnose-difficult-bugs/references/failure-patterns.md)
- [openai.yaml](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-normal-none-work-09BK3s/diagnose-difficult-bugs/agents/openai.yaml)

The skill covers evidence preservation, causal modeling, hypothesis ranking, discriminating experiments, confidence calibration, and diagnosis-only boundaries. It includes targeted playbooks for concurrency, distributed systems, regressions, performance, data, environment, and lifecycle defects.

Frontmatter and agent metadata passed equivalent YAML and structural checks. The supplied `quick_validate.py` could not run because PyYAML is absent from the environment. No TODO placeholders remain.