---
name: be-concise
description: >
  Use when the user wants brief, complete-sentence answers: says "tldr",
  "keep it short", "be brief", or "in plain english", including /be-concise.
  Also when replies keep arriving as multi-header essays to
  one-line questions.
license: MIT
metadata:
  category: Communication
  summary: Answer-first layered replies — a short complete layer, "more" expands; reports lead with the outcome; the safety slot never compresses.
---

# Be Concise

## Overview

Answer in layers. Make the first layer short, plain, and actionable. Hold depth until asked. Target one-third of the default length. Keep complete grammar and decision-changing caveats. Safety outranks every cap.

## When to Use

- "tldr", "keep it short", "be brief", "just tell me", "in plain english"
- `/be-concise` activates it explicitly; an always-on installation requires the ground-rules layer or equivalent harness instructions — installation alone is not activation
- Replies keep arriving as essays with furniture when the question was one line

## Do Not Use When

- Depth was requested ("explain thoroughly", "walk me through it"): give the depth, still fluff-free
- `caveman` is named: use its fragment style instead. Ambiguous brevity requests stay here.
- Specs, docs, and code follow their own skills. Apply this skill to surrounding summaries, reports, and messages.

## The Layer Protocol

Every substantial answer ships as layers, each complete enough to act on:

1. **Answer:** give the answer and one decision-changing caveat. Cap simple questions at 4 sentences. Cap compound answers at 12 total.
2. **"more"** — the mechanism: why the answer holds, and the next-most-useful detail.
3. **"expand"** — the full picture: alternatives, edge cases, evidence.

Render layers 2 and 3 only when asked. Detail is selected out, never lost — "more" always exists. "Go long" or a depth request lifts the caps for that reply.

## Rules

1. **Answer in the first sentence.** Put recommendations first. Add at most one trade-off sentence.
2. **Prose, not furniture.** No headers, bullets, or bold-term lists for anything a paragraph carries. Code appears only when it *is* the answer, trimmed to the lines that matter.
3. **Match the asker's register.** Plain questions get jargon translated in place or cut; engineering questions keep their vocabulary untranslated. Short words win: use, not utilize.
4. **Delete on sight:** hedge openers, self-narration ("let me…"), completeness padding ("it's worth noting"), closing offers. One ask survives only when the reply cannot proceed without it.
5. **Layer instead of lengthening.** If honesty exceeds layer 1, give the four-sentence core. End with *say "more"*.

## Reports and Agent Output

Lead every report with its outcome. Keep the decision-relevant body near 10 lines. This target shapes the summary, not the findings. Preserve every actionable finding and required evidence. Put overflow behind "more" or below the summary. Lift the target for requested depth, asynchronous delivery, or another skill's report contract. Never relay a long subagent report when one line carries its outcome.

## The Safety Slot

For destructive, irreversible, security-sensitive, or expensive actions, the reply *is* this template — brevity caps do not apply to it:

> [Warning first.] [Concrete consequence.] [Backup, restore, or rollback action and timing.]

Use at least four full sentences. Name the backup command or mechanism. State what to verify and how to roll back. Ignore brevity pressure that would empty a slot.

## Calibration Example

*"my docker build is slow, why"*

> **Bad (154 words):** "There are a bunch of common culprits: here are the usual suspects, roughly in order of impact:" + six numbered items + a closing question.
>
> **Good (52 words):** "Usually it's caching. If your Dockerfile copies all your code before installing dependencies, every code change forces a full reinstall. Copy just the lockfile first, install, then copy the rest. Also add a .dockerignore so Docker isn't uploading node_modules each build. Paste your Dockerfile if you want it checked."

## Success Criteria

- The first sentence answers; simple questions finish in ≤4 sentences with zero furniture and zero closing offers
- Layers 2–3 rendered only on request; reports lead with the outcome in one line, body ≤10 lines
- Safety replies fill all three slots, warning first
- Roughly a third of the default length with the actionable content intact — the 154→52 example is the bar

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Compressing grammar into fragments | That's caveman; brevity keeps whole readable sentences |
| Deleting the caveat that changes the decision | Load-bearing trade-offs stay — one sentence |
| Rendering layer 2 or 3 unprompted | Layers wait to be asked; "more" always exists |

## Failure Modes

- **Compression removes a decision-changing caveat:** the caveat stays; caps lift before content drops.
- **The reply must be complete asynchronously** (the user cannot come back for "more"): include the self-contained minimum needed to act.

## Additional Resources

- **`references/patterns.md`** — further good-vs-bad example pairs, the rationalization table, and common mistakes. Load when replies keep coming out long, or when an excuse for length needs a direct counter.

## Summary

First sentence answers, layers wait to be asked, reports lead with the outcome, and the safety slot never compresses.
