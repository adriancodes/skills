# Writing Instructions That Drive Behavior

A skill is only as good as whether the agent obeys it. Structure makes a skill *findable*; these six levers make it *followed*. Apply all six to every skill — they compound. Each lever is a rule in `rules.md` and a check in Phase 6.

The single highest-leverage habit: **command, don't suggest; specify the action, don't just forbid; show one example; anchor with numbers; put what matters first and last; name behaviors with words the model already knows.**

## 1. Imperative force — command, never observe

**Always write instructions as commands.** "Always X." "Never Y." Verb-first: "Validate the input." Never soften to "X is often helpful," "consider X," or "it's usually good to X."

The model processes a rule and an observation differently. A rule binds. An observation informs — and gets traded away the moment the agent is under time, sunk-cost, or authority pressure.

| Weak (observation) | Strong (rule) |
|--------------------|---------------|
| "It's usually a good idea to validate input." | "Always validate input at the boundary." |
| "You might want to write the test first." | "Write the test before the implementation." |
| "Try not to skip verification." | "Run the verification command. Paste its output." |

**Voice:** skills forbid second person. Get imperative force from verb-first commands ("Validate…", "Never skip…"), never from "You must…". Force without "you."

## 2. Positive specification — say what to do, not only what to avoid

**State the action to take.** When a prohibition is necessary, pair it with its replacement: "Never X; do Y instead." A bare "Don't do X" still forces the model to represent X to suppress it — suppression leaks. A positive target does not.

| Leaky negation | Positive specification |
|----------------|------------------------|
| "Don't be vague." | "Name the exact file, function, and line." |
| "Avoid long responses." | "Answer in 3 sentences or fewer." |
| "Don't force-push." | "Push with `--force-with-lease`, and only after the user confirms." |

**The one allowed negation: scope boundaries.** "Do Not Use When…" fences off territory, not behavior — keep it negative. The positive-rewrite rule applies to *behavioral* instructions, not to where a skill should decline to act.

## 3. Load-bearing examples — show one, completely

**Include at least one concrete, complete example of the core behavior.** One worked example overrides paragraphs of abstract description. In practice the example block is the most-read and most-imitated part of a skill — invest there before polishing prose.

- One excellent example per concept. Never dilute with five mediocre or multi-language variants.
- Make it real and runnable. Never use fill-in-the-blank templates or contrived scenarios.
- Comment the WHY, not the WHAT.

This file is itself the demonstration: every lever above leads with a before/after table, not a paragraph.

## 4. Concrete anchors — replace qualifiers with numbers

**Replace every vague qualifier with a measurable anchor wherever a limit or target is meant.** "Concise" spans a wide interpretation band; "3 sentences or fewer" collapses it. Anchors cut output *variance* more than they shift the average — that is what makes a skill reliable across invocations.

| Vague | Anchored |
|-------|----------|
| "Keep it short." | "3 sentences or fewer." |
| "Give a few examples." | "Give 2–3 examples." |
| "Cover the main cases." | "Cover the happy path and at least 2 error cases." |

## 5. Position — front-load and end-load the binding rule

**Put the single most important instruction in the first fifth and the last fifth of the block, and restate it at the end.** The start and end of a block carry the most weight; the middle attenuates. A critical rule buried mid-context gets skipped.

- Lead every skill with its core principle, not with throat-clearing.
- Within a long section, state the binding rule first, then elaborate.
- Close every skill with a one-line restatement of the rule that matters most.

## 6. Leading words — name the behavior with a pretrained concept

**Anchor each behavioral concept to a compact term the model already holds** — *adversarial*, *tracer bullet*, *red/green*, *relentless* — and repeat the term, never its definition. A pretrained word carries a distributed definition for free: every occurrence recruits the same priors and pulls the agent toward the same behavior, where a paraphrase spends tokens and dilutes the anchor.

| Spelled out (weak) | Leading word (strong) |
|--------------------|----------------------|
| "fast, deterministic, low-overhead feedback" | "a *tight* loop" |
| "a test you are confident exercises the bug" | "the test goes *red* on the bug" |
| "inputs chosen to break a naive implementation" | "*adversarial* fixtures" |

Grade a leading word with the Pruning no-op test (`rules.md`): if the model's default already matches (*be thorough* on an already-thorough agent), the word is too weak — replace it with a stronger word (*relentless*, *exhaustive*), never with a longer explanation.

Coin a new term only when no pretrained one fits: a made-up word recruits no priors, so its definition costs the tokens a pretrained word gives free.

A leading word also works in the description: when the same word lives in the user's prompts, docs, and codebase, the agent links that shared language to the skill and fires it more reliably.

## All six at once

The same instruction, before and after applying every lever.

**Before:**
> When writing tests, it's generally a good idea to write them before the code if possible. Try not to skip this — being thorough tends to pay off.

**After:**
> **Always write the test before the implementation.** If implementation exists before its test, delete it and start from the test. (See the worked red-green example below.)

Imperative force (*Always*), a prohibition turned into a positive action (*delete it and start from the test*), a concrete trigger (*if implementation exists before its test*), an example pointer, the binding rule stated first, and a leading word (*red-green*) anchoring the whole loop in one pretrained token.
