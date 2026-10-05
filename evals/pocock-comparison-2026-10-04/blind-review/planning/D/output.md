I’ll read the confirmed spec and project guidance, then write a local expand–contract breakdown with CI-green tasks sized for one agent session each. I’ll stop for your review before publishing ticket files or implementing anything.

The spec calls for six tasks: add the compatible `customerId` form, migrate each of the four packages independently, then remove `accountId`. Each package migration depends only on the expansion; removal depends on all four migrations passing their compatibility checks and CI. The fixture contains only the spec and package summaries, so the contract will define verification requirements without inventing commands.

Wrote the [slices contract](docs/specs/2026-10-04-account-id-slices.md) for review:

1. **Expand:** support `customerId` alongside `accountId`. No blockers.
2. **Migrate billing:** preserve billing behavior. Blocked by 1.
3. **Migrate exports:** preserve export behavior. Blocked by 1.
4. **Migrate notifications:** preserve notification behavior. Blocked by 1.
5. **Migrate analytics:** preserve analytics behavior. Blocked by 1.
6. **Contract:** remove `accountId` after all supported consumers are migrated. Blocked by 2–5.

Each package migration fits one agent session; every task requires green CI and applicable compatibility checks. No migration or tickets were created.

Does the granularity feel right? Are the blockers correct? Should any tasks be merged or split?