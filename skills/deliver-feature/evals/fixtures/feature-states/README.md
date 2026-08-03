# feature-states fixtures

Three tiny artifact snapshots of the same `csv-export` feature, one per
pipeline state the stage-detection table must resolve from files alone. Each
maps to exactly one expected stage, per the first-matching-row table in
`skills/deliver-feature/SKILL.md` (Workflow step 2).

| Snapshot | Artifact state | Expected detected stage | Expected exit gate |
|----------|----------------|-------------------------|--------------------|
| `spec-open/` | Decision log present with `status: open` (contents read finished; no slices file) | Spec — run `create-spec`; the open log's own contents never count as capture-mode answers | The spec's confirmation gate |
| `spec-confirmed-no-slices/` | Decision log `status: confirmed`; slices file quoted as `missing` | Task creation — run `create-tasks` | Slices `status: confirmed` (the tasks read-back) |
| `slices-ready/` | Spec confirmed; slices `status: confirmed` with slice 1 ticked and slice 2 unticked, blocked only by ticked slice 1 | Implementation — run `implement-task` on slice 2 (the first unblocked unticked slice) | Slice 2 ticked |

A sibling fixture, `../two-open-specs/`, holds two `status: open` specs that
both match the topic "export" (`csv-export` and `pdf-export`); its expected
behavior is not a stage but a question — ask which spec is meant before
anything runs.
