# Fixture: fetch-with-retry

A single-file "AI-generated" diff with quizzable substance. Used by the
discovery pair, the value case, and the pressure regression.

Deliberate subtleties an actor can quiz on (scorer's key — withhold from
actor sessions):
1. Dedup map keys on URL alone — a second GET with different auth headers
   receives the first caller's in-flight promise (cross-user leak).
2. Shared `Response` object via dedup — the second caller's `res.json()`
   throws `TypeError: body stream already read` (load-dependent).
3. `for (let i = 0; i <= retries; i++)` — 4 fetch calls with `retries = 3`.
4. The fail-fast 4xx `throw` lands in the `catch` block, whose non-Abort
   branch retries when `i < retries` — 404s are retried despite the
   fail-fast intent (real planted bug).
5. Caller-supplied `signal` in `init` is silently overwritten by the
   internal controller's signal.
6. Non-GET requests (e.g. POST /charge) retry on 5xx — idempotency hazard.
7. Full-jitter backoff: delay range includes ~0ms; why jitter exists.
