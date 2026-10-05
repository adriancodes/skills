I’ll read the confirmed spec, inspect the four packages and their checks, then write an open slices contract for your review using the supplied create-tasks instructions.

The spec supports six tasks, with compatibility checks green after each:

| Task | Scope and acceptance | Blocked by |
|---|---|---|
| T1 Expand | Add `customerId` alongside `accountId`; pass compatibility checks for all four existing consumers. | none |
| T2 Billing | Migrate billing within one agent session; pass billing and shared compatibility checks. | T1 |
| T3 Exports | Migrate exports within one agent session; pass exports and shared compatibility checks. | T1 |
| T4 Notifications | Migrate notifications within one agent session; pass notifications and shared compatibility checks. | T1 |
| T5 Analytics | Migrate analytics within one agent session; pass analytics and shared compatibility checks. | T1 |
| T6 Contract | Verify no consumers retain `accountId`, remove the old form, and pass all four packages’ checks. | T2–T5 |

The workspace contains only the spec and READMEs, so executable check commands and implementation paths remain unverified.

Writing the contract is blocked: the supplied instructions require reading `references/slices-contract.md`, which is absent from the workspace. Its supporting location is outside your authorized directory.

Please paste that reference or place it inside the workspace. I’ll then write the contract with an open status for your review. No migration or tickets have been created.