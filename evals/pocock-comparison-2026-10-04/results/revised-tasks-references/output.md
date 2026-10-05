I’m applying the supplied create-tasks instructions. I’ll read the confirmed spec, inspect the four packages and their CI checks, and write a slices contract for your review.

The spec calls for six tasks: add the compatible identifier form, migrate each package in its own session, then remove `accountId` after all four migrations pass. Each package migration can depend only on the compatibility task.

This checkout contains the spec and package READMEs, but no source, tests, or CI configuration. I’ll make the required checks explicit in the contract and flag that their commands must be identified in the implementation checkout.

Saved the [slices contract](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/skill-quality-pilot-FAY6F6/docs/specs/2026-10-04-account-id-slices.md) with `status: open` for your review.

It defines six tasks: compatible expansion, four separate one-session package migrations, and final removal. Each migration depends on expansion; removal depends on all four migrations. Every task requires compatibility checks and green CI.

The contract structure and dependency graph passed validation. This checkout contains documentation only, so exact CI commands remain to be identified. No migration was implemented.

Do you approve this breakdown?