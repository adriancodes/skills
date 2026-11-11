---
name: check-release
description: >
  Use when a finished change is about to be released to users: the user
  asks "is this safe to release", "go or no-go", "release check", or
  "what's the rollback plan". Also when a release is planned with no
  written way to undo it, or includes a database change.
license: MIT
metadata:
  category: Verification
  summary: Reads the evidence a change produced, checks what could go wrong on release, and returns GO or NO-GO with a rollback plan. It deploys nothing.
---

# Check Release

Decide whether a change is safe to release and how to undo it. Read the evidence earlier stages produced. Return GO or NO-GO. Deploy nothing.

## Scope

Use before a change is released to users or to a shared environment.

Do not use when:

- The artifact has not been tested against hostile input: use `verify-work` when installed
- The diff has not been reviewed: use `review-code` when installed
- The branch needs a pull request: use `prepare-pr` when installed
- The user wants the deploy run: this skill never runs it
- Nothing is released to anyone, as with a library or a personal tool: say the check does not apply

## Workflow

1. **Pin the release.** State the exact commit or range being released, the target environment, and the version it replaces. Ask when any of the three is unknown.

   Done when all three are stated.

2. **Read the evidence.** Record each item as pass, fail, or missing, with its source:

   - every planned task is done;
   - review findings are resolved;
   - verification passed;
   - CI passed on the release commit;
   - no blocking item is open in the spec or RFC.

   Use read-only commands. Never rerun the review or the tests to fill a gap. Record absent evidence as missing, never as pass.

   Done when every item has a status and a source.

3. **Check the release risks.** Read the diff for each:

   - **Data:** schema changes, backfills, and deletions. Mark each reversible or irreversible. A dropped or renamed column is irreversible.
   - **Configuration:** every new environment variable, secret, or flag the change reads.
   - **Order:** anything that must be released before or after this change.
   - **Overlap:** whether the old and new versions can run at the same time during rollout.
   - **Outside effects:** emails, payments, or messages that cannot be recalled.

   Done when every category is marked with a finding or "none".

4. **Ask what cannot be seen.** Ask one question per turn, and only when the answer changes the verdict, such as whether a new variable is set in the target environment. Record an unanswered item as not checked.

   Done when every verdict-changing unknown is answered or recorded as not checked.

5. **Write the rollback plan.** Give the steps that return to the replaced version, any data step, who runs them, and the signal that means roll back. When no rollback exists, say so and give the forward-fix plan.

   Done when the plan names its steps, its owner, and its trigger.

6. **Give the verdict.** Return GO only when all four hold:

   - no evidence item failed or is missing;
   - no verdict-changing item is not checked;
   - every data change is reversible;
   - the rollback plan is written.

   Otherwise return NO-GO and list what gets it to GO. When the user accepts a named risk in words, return "GO with accepted risk" and quote them.

   Done when the verdict follows from the recorded items.

7. **Report.** Lead with the verdict. Then give the checks as a table, what gets to GO, the rollback plan, and what to watch in the first hour. Write the report to `docs/releases/<yyyy-mm-dd>-<slug>.md`, or the path the project's instructions give.

   Done when the report file exists and leads with the verdict.

## Pressure

- **"CI is green, just say GO":** green CI is one evidence item. Keep the verdict the recorded items produce.
- **The user releases against a NO-GO:** that is their decision. Record it in the report and leave the verdict unchanged.
- **A deadline:** it changes nothing a check found. Offer the smallest change that gets to GO.

## Verification

Every evidence item has a status and a source. No check was rerun and nothing was deployed or changed in any environment. The verdict matches the recorded items, and the report holds a rollback plan.
