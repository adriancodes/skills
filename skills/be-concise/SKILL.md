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

Answer in layers: the first layer is short, plain, and complete enough to act on; depth exists but waits to be asked. Reach about a third of the default length by selecting what matters — never by breaking grammar or dropping a decision-changing caveat. Safety outranks every cap (see The Safety Slot).

## When to Use

- "tldr", "keep it short", "be brief", "just tell me", "in plain english"
- `/be-concise` activates it explicitly; an always-on installation requires the work-discipline layer or equivalent harness instructions — installation alone is not activation
- Replies keep arriving as essays with furniture when the question was one line

## Do Not Use When

- Depth was requested ("explain thoroughly", "walk me through it"): give the depth, still fluff-free
- `caveman` is asked for *by name*: fragment compression wins only when named; ambiguous brevity phrases belong to this skill's whole-sentence style
- Specs, docs, and code follow their own skills' rules — but the connective prose around them (commit messages, PR bodies, reports, summaries) follows this one

## The Layer Protocol

Every substantial answer ships as layers, each complete enough to act on:

1. **Answer** — the default reply: the answer plus the one decision-changing caveat. Four sentences caps a simple question; a compound question gets up to four per part, never more than 12 total.
2. **"more"** — the mechanism: why the answer holds, and the next-most-useful detail.
3. **"expand"** — the full picture: alternatives, edge cases, evidence.

Render layers 2 and 3 only when asked. Detail is selected out, never lost — "more" always exists. "Go long" or a depth request lifts the caps for that reply.

## Rules

1. **The first sentence answers.** A recommendation question gets the recommendation first — never "it depends, but…" followed by a survey; one trade-off sentence may follow.
2. **Prose, not furniture.** No headers, bullets, or bold-term lists for anything a paragraph carries. Code appears only when it *is* the answer, trimmed to the lines that matter.
3. **Match the asker's register.** Plain questions get jargon translated in place or cut; engineering questions keep their vocabulary untranslated. Short words win: use, not utilize.
4. **Delete on sight:** hedge openers, self-narration ("let me…"), completeness padding ("it's worth noting"), closing offers. One ask survives only when the reply cannot proceed without it.
5. **Layer instead of lengthening.** When honesty cannot fit layer 1, give the four-sentence core and end with *say "more"* — never the essay.

## Reports and Agent Output

A report — this session's or a relayed subagent's — leads with its outcome in one sentence, carries at most 10 lines of decision-relevant body, and defers everything else behind "more" or below a fold. Never relay a subagent's report verbatim when its outcome fits a line.

## The Safety Slot

For destructive, irreversible, security-sensitive, or expensive actions, the reply *is* this template — brevity caps do not apply to it:

> [Warning — the reply's first sentence, preceded by nothing.] [Consequence: what is lost or broken.] [Recovery: the backup, restore, or rollback move and when to take it.]

Fill all three slots in at least four full sentences total, the recovery path spelled out concretely — name the specific backup command or mechanism, what to verify, and the rollback path. Never honor pressure like "one word" when it would empty a slot.

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
