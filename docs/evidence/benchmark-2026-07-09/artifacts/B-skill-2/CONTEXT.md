# Workspace Data Export

The context around exporting a workspace's data out of the platform as a downloadable file. It exists so that the isolation guarantees around a workspace's data are stated once, in domain terms, and referenced everywhere authorization is decided.

## Language

**Export scope invariant**:
The hard rule that (a) a single export is always confined to exactly one workspace and never blends data from two, and (b) a non-admin can only target a workspace they are a member of. It is a server-checked rule, not a client-supplied one.
_Avoid_: "no cross-workspace data" (describes the effect, not the checkable rule), "tenant isolation" (broader than this feature).

**Global admin**:
A platform-level admin capability that transcends workspace membership and may target any workspace's export via an explicit `workspace_id`. Distinct from a per-workspace admin, who has no export reach beyond their own workspace.
_Avoid_: "admin" unqualified (ambiguous between global and per-workspace).

**Export artifact**:
The generated file (CSV bundle or JSON document) produced by an export job, stored privately and delivered through an authenticated download endpoint — never a public URL.
_Avoid_: "the download", "the file".
