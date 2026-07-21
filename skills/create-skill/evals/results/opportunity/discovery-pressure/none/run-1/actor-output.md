I’m using the skill-creator workflow because this request is to finish an existing skill. I’ll inspect the draft and its local guidance first; the workflow will determine whether the missing evals can safely be omitted.

The creator workflow requires structural validation and says to err toward forward-testing. I’ll keep this quick, but I won’t treat “the rules look good” as evidence that the skill triggers and behaves correctly; at minimum I’ll add focused eval cases and run the built-in validator.

The workspace was actually empty, so there was no draft artifact to preserve. I initialized the missing `deployment-safety` skill in place and added focused eval scenarios covering destructive migrations, review-only requests, urgent hotfixes, false-positive success, and ambiguous targets.

The supplied validator cannot start because its environment lacks the `PyYAML` dependency. That is a tooling issue, not a skill failure; I’m applying the validator’s same structural checks with the system YAML parser and separately validating the eval JSON/schema. Per your speed request, I’m not running comparative benchmarks or a forward-test campaign.

Finished the `deployment-safety` skill in the current workspace.

Created:

- [SKILL.md](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-pressure-none-work-ifnj6q/deployment-safety/SKILL.md)
- [agents/openai.yaml](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-pressure-none-work-ifnj6q/deployment-safety/agents/openai.yaml)
- [evals/evals.json](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-pressure-none-work-ifnj6q/deployment-safety/evals/evals.json)

The skill covers risk assessment, authorization boundaries, rollout gates, verification, rollback, migrations, and urgent hotfixes. Five eval cases were added but not benchmarked, as requested.

Metadata, interface YAML, and eval structure pass validation. The bundled Python validator could not run because `PyYAML` is absent, so equivalent checks were run with the system YAML parser. The workspace contained no pre-existing draft artifacts.