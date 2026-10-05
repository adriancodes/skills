I’ll use the supplied create-tasks workflow to read the confirmed spec, map the four packages, and write bounded slices that keep CI green. I’ll leave the contract open for your review.


The plan has six slices: add the compatible `customerId` form, migrate each package in its own session, then remove `accountId`. All four package migrations depend only on the compatibility slice; removal waits for all four.

The layers are the shared public type, package callers, and compatibility checks. This workspace contains only the spec and package READMEs, so I’ll bound tasks by those surfaces and leave source-file and command selection to implementation. `CONTRIBUTING.md` is absent.


Created [the slices contract](docs/specs/2026-10-04-account-id-slices.md) with six bounded tasks:

1. Add compatible `customerId` support.
2. Migrate billing.
3. Migrate exports.
4. Migrate notifications.
5. Migrate analytics.
6. Remove `accountId`.

Each package migration fits one session and depends only on task 1. Removal waits for all four migrations. Every task requires compatibility checks and CI to pass.

The contract remains `open`; no migration was implemented. Required repository checks failed with `MODULE_NOT_FOUND`: `scripts/skills.mjs` and `scripts/validate-personas.mjs` are absent.

Do you confirm these slices, bounds, and dependencies?