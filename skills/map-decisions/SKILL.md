---
name: map-decisions
description: Map a project's settled, unanswered, and unspecified decisions across bounded workstreams and sessions.
disable-model-invocation: true
license: MIT
metadata:
  category: Planning
  summary: Creates a resumable decision map with owners, dependencies, authoritative answers, and the next unblocked question.
---

# Map Decisions

Preserve settled decisions. Map what remains unanswered without inventing choices or implementation tasks.

## Scope

Covers decisions that span several workstreams or sessions.

Do not use for:

- A single bounded feature specification: use `create-spec`; confirm requirements and acceptance criteria if unavailable.
- Implementation planning from confirmed scope: use `create-tasks`; create bounded tasks from the spec if unavailable.
- Generating alternatives for one open choice: tell the user to run `explore-options`. If it is not installed, compare distinct approaches under stated criteria.
- External tracker administration: keep this map local unless tracker work is separately requested.

## Workflow

### 1. Name the outcome

Read existing notes, decisions, and project conventions.
State the outcome these decisions must enable.
Bound the workstreams needed for that outcome.
Keep unrelated opportunities outside the map.
Preserve existing owners and authoritative answers.
Mark missing owners as unknown rather than assigning them silently.

Done when the outcome and decision boundaries are explicit.

### 2. Create bounded records

Give each decision a stable identifier and one owning record.
Keep all records in one index file until a record needs more than a few lines.
Then move that record to its own file and link it from the index.
Classify it as settled, unanswered, or unspecified.
For a settled decision, point to its authoritative answer and constraints.
For an unanswered decision, write the precise question and evidence needed.
For an unspecified area, record what must become known before framing a question.
Record only actual dependencies.
Keep implementation details outside decision records unless they constrain the choice.

Done when every record has a state, owner or explicit owner gap, and a reason it belongs in the map.

### 3. Connect and validate

Write an index linking the records and their dependencies.
Check each target exists.
Check identifiers are unique.
Detect cycles and surface contradictory dependency statements.
Identify one unanswered decision whose prerequisites are settled.
If none is unblocked, name the smallest owner clarification that can break the blocker.
Keep unspecified areas visible without inventing a ticket backlog.

Done when the next decision is genuinely unblocked or the blocking cycle is explicit.

### 4. Save for continuation

Follow local conventions or use `docs/decisions/<topic>/` with an index.
Include the outcome, record links, current blockers, and next question in the index.
Update existing records in place rather than creating competing maps.
Hand a settled bounded workstream to `create-spec` when implementation specification is requested.
Leave product answers and external writes with their authorized owner.

Done when another session can locate the next question without reopening settled work.

## Worked example

> Billing migration outcome: enough confirmed decisions to specify each workstream.
> BM-01 currency: settled, USD only, owner Adrian.
> BM-02 provider: unanswered, owner Adrian, no prerequisite.
> BM-03 cutover: unanswered, owner Platform, depends on BM-02.
> BM-04 reconciliation: unspecified until provider event behavior is known.
> Next: gather provider API evidence for BM-02; keep BM-03 and BM-04 blocked.

## Verification

Resolve every index link and dependency target.
Check the graph for cycles and the next question against its prerequisites.
Check that settled answers and unknowns survived unchanged.
Map decisions, owners, and blockers before turning confirmed scope into implementation work.
