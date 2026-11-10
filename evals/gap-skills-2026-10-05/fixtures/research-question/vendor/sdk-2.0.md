# Atlas Upload SDK 2.0

Synthetic vendor primary-source fixture, revision 2026-09-20.

`start(file)` returns a token. `resume(token, offset, bytes)` continues a partial upload. These methods first appear in SDK 2.0 and require server protocol v2. Migrating the client alone does not upgrade the server.
