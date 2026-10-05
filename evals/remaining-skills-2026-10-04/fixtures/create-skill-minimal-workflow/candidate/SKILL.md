---
name: minimal-workflow
description: Use when the user asks to "summarize this incident" or "write the incident handoff" from a completed incident timeline.
license: MIT
metadata:
  category: Communication
  summary: Converts a completed incident timeline into a factual handoff.
---

# Minimal Workflow

## Scope

Use when a completed incident timeline needs a handoff.

Do not use for active incident diagnosis. Use `diagnose` when installed; otherwise establish the cause before writing the handoff.

## Workflow

1. Extract the impact, recovery action, and unresolved follow-up from the timeline. Mark absent facts unknown.

   Done when every statement traces to a timeline entry or is marked unknown.
2. Write one sentence for each extracted item.

   Done when the handoff includes impact, recovery, and follow-up without inventing facts.

   Example: Given "09:00 login errors; 09:10 rollback restored login; cause unknown", write "Login failed from 09:00 to 09:10. A rollback restored login. The cause remains unknown."

## Verification

- Every factual statement matches the supplied timeline.
- Missing facts remain unknown.
