# Session Documents

The three documents a spec session writes. Load this file at session open, before creating the decision log. All paths are relative to the target repo's root — as defaults: when the repo's CLAUDE.md (or AGENTS.md) names a different home for specs, ADRs, or the glossary, that pointer wins.

**The log is the sole decision channel.** No glossary entry, ADR sentence, or any other artifact states a choice that lacks a decided or ASSUMED entry in the decision log — an ADR's optional sections included: content committing the build to anything is itself a decision, enters the log first, and is read back at the gate.

## 1. Decision log — always

One file per spec session: `docs/specs/<yyyy-mm-dd>-<slug>.md`. Create it at session open; append to it the moment each decision resolves.

```md
---
topic: One-sentence statement of what is being specified
status: open   # open | confirmed | confirmed-by-override
started: 2026-07-04
---

# Spec: <topic>

## Branches

- [x] Purpose — resolved
- [ ] Distribution
- [ ] Naming

## Decisions

1. **Purpose** — Personal toolbox, published. _Why:_ lowest friction to start; a theme can emerge later.
2. **Distribution** — Dual-channel (CLI + plugin). _Why:_ packaging already solved once; reuse it.

## Assumptions

- ASSUMED: MIT license — matches the author's other repos; correct at the read-back if wrong.

## Deferred

- Versioning scheme — deliberately left open until the second skill ships.

## Confirmation

<!-- Filled only by the exit gate: the user's confirming words, verbatim, plus the date. -->
```

Rules:

- **Append on resolution.** Write each decision when it lands, never batched at session end.
- **Supersede, don't rewrite.** A reversed decision gets a new numbered entry pointing at the old one ("supersedes #3"); history stays intact. Only the user reverses a decision after `status: confirmed`: a superseding entry then carries the user's explicit say-so in its _Why_, or the branch reopens and the gate re-runs.
- **One log per topic.** At session open, scan `docs/specs/` for a log with `status: open` on the same topic and resume it instead of starting a second.
- **Every decision qualifies.** The log has no significance bar — only ADRs do.
- **Provenance in capture mode.** Entries synthesized from an earlier conversation cite the user's words or position in their _Why:_; assumptions carry the ASSUMED marker; open items live under Deferred. No fourth category exists.
- **Deferral is granted, never taken.** A branch enters Deferred only with the user's assent or via the delegation/impatience paths in SKILL.md; a branch the build depends on never defers.

## 2. Glossary — when terms crystallise

Lives at `CONTEXT.md` in the repo root. Create it lazily, on the first resolved term.

```md
# <Context Name>

<One or two sentences: what this context is and why it exists.>

## Language

**<Term>**:
<One or two sentences defining what the term IS — not what it does.>
_Avoid_: <the rejected synonyms>
```

Rules:

- **One word wins.** When several words compete for a concept, pick the canonical one and list the losers under `_Avoid_`. A canonical-term choice is a naming decision: it enters the glossary only through a decided or ASSUMED entry in the decision log, and is read back at the gate like any other decision.
- **Domain terms only.** General programming concepts (retry, timeout, handler) never enter the glossary, however often the project uses them.
- **Challenge on conflict.** When a statement uses a term contrary to its glossary definition, stop and resolve the conflict before the next question.
- **Multi-context repos.** If `CONTEXT-MAP.md` exists at the root, it lists per-context `CONTEXT.md` files and their relationships; add terms to the context the current topic belongs to, and ask when the context is unclear.

## 3. ADR — rarely

Lives at `docs/adr/NNNN-<slug>.md`, numbered from the highest existing number plus one. Create the directory lazily, on the first ADR.

Offer an ADR only when **all three** hold:

1. **Hard to reverse** — changing course later carries real cost.
2. **Surprising without context** — a future reader would ask "why on earth?"
3. **Real trade-off** — genuine alternatives existed and one was chosen for reasons.

Any test fails → the decision stays in the decision log alone.

```md
# <Short title of the decision>

<1–3 sentences: the situation, the decision, and why. A single paragraph is a complete ADR.>
```

Optional additions — only when they earn their place: `status` frontmatter (`proposed | accepted | deprecated | superseded by NNNN`), a Considered Options list when the rejected paths are worth remembering, a Consequences note for non-obvious downstream effects.
