# Workspace Data Export

The bounded context for exporting a workspace's data on demand: who may trigger
an export, what it contains, and how the resulting file reaches the requester.

## Language

**Workspace**:
The tenancy boundary that owns all exportable data; the single unit an export is
scoped to. Data never crosses a workspace boundary except via the audited
global-admin exception.
_Avoid_: org, account, tenant.

**Global admin**:
A platform-level role permitted to export *any* workspace through the audited
cross-workspace exception. Distinct from a workspace's own Owner/Admin, who are
confined to their one workspace.
_Avoid_: superadmin, admin (bare — ambiguous against workspace admin).

**Export job**:
One asynchronous unit of work that produces one archive for one workspace in one
format. Carries a job id and a status.
_Avoid_: export task, export request.

**Export archive**:
The generated `.zip` artifact holding one file per entity type; the object the
download link serves.
_Avoid_: export file, dump, download.
