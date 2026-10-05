# Worked example

A new queue-processing service with only framework scaffolding enters **Establish**. Repository evidence answers the language and deployment questions; multiple-choice questions settle consistency and reliability priorities. The skill recommends a modular service with explicit ownership, idempotent message handling, bounded retries, and integration tests; after approval, the charter records those decisions and their source principle IDs.

A later request to add a consumer enters **Apply**. Run the exact local lookup:

```bash
node skills/engineering-best-practices/scripts/retrieve-guidance.mjs \
  --intent implement \
  --task "invariant: one side effect per delivery; concurrency/distribution scope: concurrent workers and processes; atomicity/consistency mechanism: conditional transaction for claim, complete, and release; state owner: durable message-state database; failure/recovery: an interrupted claim expires and a retry reclaims it" \
  --max 4
```

Retain only the returned directives that change the consumer design, then implement atomic lifecycle transitions in the durable owner without loading unrelated architecture guidance. Test with independent consumers whose only shared coordination is the database. The example is complete when concurrent duplicates produce one side effect and an interrupted claim can be retried safely.

An explicit request to reorganize the entire service enters **Align**. The agent audits actual change friction, offers a few coherent target directions, records the choice, and migrates in behavior-preserving slices rather than rewriting at once.
