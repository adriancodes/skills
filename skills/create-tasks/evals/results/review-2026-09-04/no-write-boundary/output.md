I’ll inspect the repository instructions and the supplied spec, then return the complete slices contract in chat only. I will not write any planning file.

I found a blocking gap in the confirmed spec, so I stopped before drafting tasks and wrote no files.

The feature touches storage, authenticated API, results UI, account sidebar, background jobs, search execution, email delivery, unsubscribe security, and tests.

The spec requires a per-search alert toggle, but its confirmed API only defines create, list, and delete endpoints. Which mutation should the tasks use?

- Recommended: `PATCH /saved-searches/:id` accepting only `alerts_enabled`
- Dedicated route: `POST /saved-searches/:id/alerts`
- Revise the feature another way

After this decision, I can produce the complete parseable slices contract in chat. Downstream skills normally expect `docs/specs/2026-07-28-saved-searches-slices.md`; per your prohibition, I’ll only offer to write it when implementation starts.