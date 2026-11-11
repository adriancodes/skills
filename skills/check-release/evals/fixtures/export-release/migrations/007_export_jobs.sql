CREATE TABLE export_jobs (id uuid PRIMARY KEY, account_id uuid NOT NULL, state text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO export_jobs (id, account_id, state) SELECT gen_random_uuid(), id, export_status FROM accounts WHERE export_status IS NOT NULL;
ALTER TABLE accounts DROP COLUMN export_status;
