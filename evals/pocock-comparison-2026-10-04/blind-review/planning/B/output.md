I’ll apply the supplied create-tasks instructions, read the confirmed spec and repository guidance, and write bounded slices with CI checks for each task.


The spec calls for six slices: add the compatible `customerId` form, migrate each package in its own session, then remove `accountId`. The four package migrations can proceed independently after the additive change.

This workspace contains only the spec and package READMEs. I’ll bound the tasks by package and public contract, with existing compatibility checks required in every slice; there are no executable CI checks here to run.


Created the [slices contract](docs/specs/2026-10-04-account-id-slices.md) with six tasks:

- Add compatible `customerId` support.
- Migrate billing, exports, notifications, and analytics in four independent, one-session tasks.
- Remove `accountId` after all four migrations.

Each slice includes bounds, a runnable demo, compatibility checks, and a green-CI completion requirement. Status remains `open`; no migration was implemented.

Do you confirm these slices?