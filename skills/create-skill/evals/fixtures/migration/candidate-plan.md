# Migration plan

1. Add `plan_code` and deploy version N with dual writes.
2. Backfill `plan_code` from `legacy_plan`.
3. Drop `legacy_plan` immediately after the backfill.
4. Deploy version N+1.

Rollback: redeploy version N.
