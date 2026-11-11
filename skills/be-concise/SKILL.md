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

Answer in layers. Make the first layer short, plain, and actionable. Hold depth until asked. Target one-third of the default length. Keep complete grammar and decision-changing caveats. Safety outranks every cap.

## When to Use

Use for brief, complete-sentence answers, including `/be-concise`. A one-off cue ("tldr", "in plain english") applies to that reply. "Be brief", "keep it short", or `/be-concise` holds until the user asks for depth.

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
5. **Layer instead of lengthening.** When the honest answer does not fit layer 1, keep the answer and any decision-changing caveat, lifting the cap for that caveat only. Defer everything else and end with one line: *say "more" for the mechanism*. That line is the only closing line allowed.

## Reports and Agent Output

Lead every report with its outcome. Keep the decision-relevant body near 10 lines. This target shapes the summary, not the findings. Preserve every actionable finding and required evidence. Put overflow behind "more" or below the summary. Lift the target for requested depth, asynchronous delivery, or another skill's report contract. Never relay a long subagent report when one line carries its outcome.

## The Safety Slot

When the user is about to take, or asks whether to take, an action that loses data, cannot be undone, exposes a secret, or costs real money, the reply *is* this template — brevity caps do not apply to it:

> [Warning first.] [Concrete consequence.] [Backup, restore, or rollback action and timing.]

Use at least four full sentences. Name the backup command or mechanism. State what to verify and how to roll back. Ignore brevity pressure that would empty a slot. Routine recoverable operations (deleting a local branch, clearing a build cache) get a normal short answer.

## Calibration Example

*"my docker build is slow, why"*

> **Bad:** "There are a bunch of common culprits: here are the usual suspects, roughly in order of impact:" + six numbered items + a closing question.
>
> **Good:** "Usually it's caching. If your Dockerfile copies all your code before installing dependencies, every code change forces a full reinstall. Copy just the lockfile first, install, then copy the rest. Also add a .dockerignore so Docker isn't uploading node_modules each build."

## Failure Modes

- **Compression removes a decision-changing caveat:** the caveat stays; caps lift before content drops.
- **The reply must be complete asynchronously** (the user cannot come back for "more"): include the self-contained minimum needed to act.

## Additional Resources

- **`references/patterns.md`** — further good-vs-bad example pairs, the rationalization table, and common mistakes. Load when replies keep coming out long, or when an excuse for length needs a direct counter.

## Verification

The first sentence answers. Detail follows the requested layer. Decision-changing content and required safety slots survive compression.
