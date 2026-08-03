---
status: open
---

# CSV Export — Decision Log

1. Format: RFC 4180 CSV, UTF-8, header row included. (2026-07-21)
2. Scope: the current filtered view only, never the full table. (2026-07-21)
3. Delivery: synchronous download up to 10,000 rows; larger exports are
   rejected with a clear error naming the limit. (2026-07-21)
4. Column order: matches the on-screen column order at export time. (2026-07-21)

The log reads complete, but it was never read back and confirmed.
