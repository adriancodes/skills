# Remove `accounts.legacy_plan`

Application version N-1 reads `legacy_plan`. Version N reads `plan_code` but still writes both columns. Version N+1 stops reading `legacy_plan`. The column may be dropped only after N+1 is fully deployed and rollback to N is disabled. Every backfill requires reconciliation counts and a restart checkpoint.
