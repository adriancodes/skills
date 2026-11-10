# Retry-model experiment

Production code is under src/. Put clearly named throwaway experiments under prototypes/. Use Node built-ins. No live payment service is available. The design question concerns enqueueing while a prior send is pending; it does not establish server-side idempotency.
