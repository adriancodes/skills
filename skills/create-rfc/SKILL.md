---
name: create-rfc
description: >
  Use when something is to be built and how to build it is undecided:
  the user asks to "write an RFC", "which approach should we take", or
  "should we use X or Y". Also when two or more workable routes would
  produce different systems and one is about to be picked without
  weighing them.
license: MIT
metadata:
  category: Planning
  summary: Writes a short RFC that compares the real approaches on the user's own criteria, recommends one, and records the user's choice.
---

# Create RFC

Settle which approach to take before a spec pins down what gets built. Compare real options on the user's criteria. Recommend one. The user chooses.

## Scope

Use when two or more workable approaches would produce different systems and none has been chosen.

Do not use when:

- The approach is chosen or obvious: use `create-spec` when installed, otherwise write the spec directly
- Who it is for, why, or what done looks like is unknown: use `gather-requirements` when installed, otherwise ask for the missing items one at a time first
- The options differ only in detail: record the detail as a spec decision
- The user wants many unusual ideas, not a decision: use `explore-options` when installed
- One factual question decides it: answer the question

## Workflow

1. **Open.** Announce the skill by name. Read the repository, specs, ADRs, and `docs/rfcs/` before writing. Resume a matching draft RFC. Treat a confirmed requirements read-back as the requirements. State the decision as one question.

   Done when the decision question is on the page.

2. **Set the criteria.** List 3–6 criteria the options will be judged on. Take each from the user's stated requirements and constraints, and cite the words. Tag any criterion the user did not state as ASSUMED.

   Done when every criterion is cited or tagged.

3. **Find the options.** Name 2–4 workable approaches that would produce different systems.

   - Include the simplest approach that could work.
   - Include "do nothing" when it is a real choice.
   - Drop any option nobody would choose. Never add one to make the recommendation look better.
   - Drop any option that fails a requirement the user stated as a must. Name it in one line as ruled out, with the requirement it fails. Do not compare it.
   - Check the repository before calling an option easy or hard. Cite the file. Mark a claim that was not checked as unverified.
   - Stop when fewer than two real options remain. Say so and name `create-spec` as the next step.

   Done when every option is workable and distinct.

4. **Compare.** Judge every option against every criterion. State for each option what it costs, what it risks, and what it makes hard to change later.

   Done when no option-criterion cell is empty.

5. **Recommend.** Recommend one option and tie the reason to the criteria. State what fact would change the recommendation. List open questions, and mark each one that blocks the decision.

   Done when the recommendation names its deciding criteria.

6. **Write the RFC.** Create `docs/rfcs/<yyyy-mm-dd>-<slug>.md` from the template below with `status: draft`. Use the path the project's instructions give when they re-home RFCs. Keep it under 700 words. Leave out anything the decision does not depend on.

   Done when the file exists and every section is filled.

7. **Get the decision.** Ask any blocking open question first, one per turn. Then present the options through the harness's multiple-choice UI, or as a numbered list, with the recommendation first. The user chooses. Record the choice and the user's words under Decision with the date. Set `status: approved` or `status: rejected`. Record a choice that differs from the recommendation as chosen. Name a serious risk once. Never re-argue it.

   Done when the RFC records the user's choice.

8. **Hand off.** Name the RFC path and `create-spec` as the next step. Continue into it only when the user's request already covered later stages.

   Done when the next step is named.

## Template

```markdown
---
topic: <the decision in a few words>
status: draft
date: <yyyy-mm-dd>
---

# RFC: <the decision as a question>

## Problem
<What needs deciding, and why now.>

## Criteria
1. <criterion> — "<the user's words>"

## Options
### A. <name>
<What it is. Cost. Risk. What it makes hard to change later.>

## Comparison
| Criterion | A | B |
|---|---|---|

## Recommendation
<Option, the criteria that decide it, and what fact would change it.>

## Open questions
- <question> — blocking / not blocking

## Decision
<Chosen option, the user's words, date.>
```

## Failure Modes

- **"Just pick one":** record the recommendation as chosen, quote the delegation under Decision, and set `status: approved`.
- **The user chooses before the RFC is written:** write the RFC anyway with that choice recorded, so the reasons are kept.
- **No repository or no file-write access:** give the RFC in the conversation as a fenced block and state where it would live.

## Verification

Every option is workable and was judged on the same cited criteria. The RFC is under 700 words. The Decision section holds the user's own choice. No spec or code was written.
