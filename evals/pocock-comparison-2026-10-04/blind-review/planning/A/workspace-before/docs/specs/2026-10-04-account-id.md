---
status: confirmed
---
# Rename accountId to customerId

A shared public type exposes accountId. Four independently released packages consume it: billing, exports, notifications, and analytics. The rename must preserve all consumers' behavior and keep CI green after every task. Each package has its own compatibility checks. Billing and exports each need one fresh agent session; notifications and analytics each need one. Add the compatible customerId form alongside accountId first, migrate callers in bounded packages, and remove accountId only after every consumer is migrated. No database migration, new behavior, or UI work is included. The user approved these requirements on 2026-10-04.
