I’m using the spec-planning skill because this request needs requirements, open decisions, and risks pinned down before implementation. I’ll inspect its guidance, then draft the specification.

The workspace has no existing specs, ADRs, glossary, or repository context, and it is read-only. Per the skill’s no-write fallback, I’ll maintain the decision log in the conversation and present a saveable specification after the decisions are confirmed.

Problem statement: define a service that lets multiple isolated customers index and search their own content safely and reliably.

What search model should the first production version support?

1. **Tenant-private documents (recommended):** each tenant indexes and searches only its own corpus.
2. **Private plus shared corpus:** tenant content is combined with platform-managed shared content.
3. **Hierarchical tenants:** organizations and subaccounts can selectively share indexes.

Which option should the specification use?
