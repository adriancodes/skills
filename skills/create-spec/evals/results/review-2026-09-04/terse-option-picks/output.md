I’m continuing with the supplied `create-spec` skill. With file writes unavailable for this scenario, I’m keeping the updated decision log in the conversation and recording your latest answer before asking the next single question.

```md
---
topic: Email notification behavior
status: open
---

# Spec: Email notification behavior

## Branches

- [x] Triggering events
- [x] Delivery timing
- [ ] Recipient policy

## Decisions

1. **Triggering events** — Send emails for both assignments and comments. _Why:_ the user selected option 3.
2. **Delivery timing** — Combine notification emails into an hourly digest. _Why:_ the user selected option 2.

## Assumptions

_None._

## Deferred

_None._

## Confirmation

<!-- Filled only after the final read-back. -->
```


Recorded: email notifications use an **hourly digest**.

Who should receive them?

1. **Directly affected users (recommended):** assignments notify the assignee; comments notify the item’s assignee.
2. **All participants:** notify the assignee and everyone who has commented.
3. **Explicit subscribers:** notify only users subscribed to the item, requiring subscription controls.

Or specify another recipient policy.