# Repository Agent Guide

This file governs agents changing this repository. It is not installed user behavior.

## Purpose

Maintain a small toolbox of self-contained, evidence-backed agent skills.

| Layer | Owns |
|---|---|
| `ground-rules/` | Always-on operating behavior |
| `skills/` | Task workflows |
| `agents/` | Specialist perspective and output contracts |
| `docs/` | Decisions, evidence, and contributor guidance |
| per-skill `evals/` | Risk-scaled behavioral evidence |
| root `evals/` | Cheap catalog-wide routing checks |

Keep each rule in one layer. Personas may use skills; they never duplicate a skill's workflow or invoke other personas.

## Before Editing

1. Read `CONTRIBUTING.md` and the files being changed.
2. Search for an existing rule, helper, case, or pattern before adding one.
3. Preserve user work and unrelated changes.
4. Freeze the current behavior or failure before changing logic.

Use `create-skill` for new skills and behavior-changing skill edits. Scale evidence to consequence. Never weaken a valid case to make a revision pass.

## Writing

Write one behavioral decision per sentence or bullet. Lead with the command. Put rationale next. Put completion criteria on their own `Done when ...` line.

Use short, literal names. Delete prose that does not change behavior. Keep runtime references inside their skill so individual installs work.

## Verification

Run these checks after repository changes:

```bash
node scripts/skills.mjs check
node scripts/skills.mjs readme --check
node scripts/skills.mjs route
node scripts/validate-personas.mjs
```

Run the affected skill's own evals when its behavior or description changes. Update `CHANGELOG.md` for shipped behavior changes. Report failing checks exactly and limit claims to the evidence that passed.
