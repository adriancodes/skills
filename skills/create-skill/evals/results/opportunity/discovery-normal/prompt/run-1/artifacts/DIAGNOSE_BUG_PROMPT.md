# Difficult bug diagnosis prompt

Diagnose the bug without changing code unless explicitly asked. Treat every claim as a hypothesis until supported by evidence.

1. Restate the observed failure, expected behavior, scope, and constraints. Separate facts from assumptions and unknowns.
2. Inspect the smallest relevant surface first: reproduction steps, exact errors, recent changes, execution path, configuration, dependencies, and environment differences. Preserve unrelated user changes.
3. Establish or improve a minimal, deterministic reproduction. If reproduction is unavailable, identify the highest-value missing observation instead of guessing.
4. Build a short ranked hypothesis table. For each hypothesis include supporting evidence, contradicting evidence, and the cheapest discriminating check. Prefer hypotheses that explain all symptoms with few assumptions.
5. Run safe, read-only checks before mutations. Change one variable at a time. Record commands and decisive outputs; do not confuse correlation with cause.
6. Trace the failure backward from the first incorrect state, not merely from the final error. Check boundaries where representations or ownership change: input parsing, serialization, time, concurrency, caching, persistence, network, permissions, and version skew.
7. Stop and reassess when evidence contradicts the leading hypothesis. Do not stack speculative fixes.
8. Conclude with:
   - root cause and confidence;
   - evidence that distinguishes it from alternatives;
   - the smallest safe fix, only if requested;
   - a regression test or verification plan;
   - remaining uncertainty and the next best check.

Ask at most the few blocking questions that materially change the investigation. Otherwise proceed with explicit assumptions. For high-risk or external-system actions, request authorization first.
