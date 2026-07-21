---
topic: A script letting users install one, some, or all of the toolbox's skills
status: open
started: 2026-07-08
---

# Spec: install script

## Branches

- [x] Design shape — run context, selection UX, destinations, copy semantics (bundled: one coherent design)
- [x] Layer handling — work-discipline installs to output-styles, not skills
- [x] Out of scope — uninstall, remote curl-install before the repo is published

## Decisions

1. **Design shape** — Node CLI, run via `npx github:adriancodes/skills` (post-publish) or `node scripts/install.mjs` (clone). Zero npm dependencies; interactive picker on no args; `--all`, `--list`, `--project`, `--dir` flags; skills copy to `<base>/skills/<name>`, the layer to `<base>/output-styles/`. _Why:_ user picked Node CLI over clone-local bash and curl-remote, accepting the Node dependency and overlap with `npx skills add`. (2026-07-08)
2. **Dynamic discovery** — The CLI scans `skills/*/SKILL.md` plus `work-discipline/` at runtime; adding a skill to the repo requires no script change. _Why:_ maintenance-free as the toolbox grows.
3. **Non-TTY behavior** — No args without a terminal prints usage and exits 1; the interactive picker never blocks a pipe. _Why:_ `curl | npx`-style invocations must fail loudly, not hang.

4. **Multi-harness targets** — A harness table drives destinations: `claude` (native + output-styles), `agents` (the canonical `~/.agents/skills` read by Codex, Gemini CLI, Copilot, Amp, Zed, Cline, Warp), `cursor`, `opencode`, `continue`, `windsurf`. Default target is `claude,agents`; `--harness all` installs to every detected harness; duplicate destinations (project `.agents/skills` shared by several) dedupe with merged labels. The layer installs natively only where output styles exist; elsewhere the CLI prints the paste-into-instructions note. _Why:_ user: "I want the script to be able to install the skills on every agent harness"; paths verified against the vercel-labs/skills CLI's published map. (2026-07-08)

## Assumptions

- ASSUMED: re-running the installer replaces installed copies in place (that is the update path); uninstall is documented as `rm -r`, not a subcommand.
- ASSUMED: `npx github:` invocation only works once the repo is on GitHub; until then the clone-local form is the tested path.

## Deferred

## Verification

`verify-work` ran against the script: 4 rounds, 21 executed attacks. One finding (raw stack trace on readonly destination), patched, re-run clean; rounds 3–4 dry. The multi-harness rewrite got 2 further rounds (9 attacks under a faked `$HOME`): detection, `--harness all`, unknown harness, `--dir`/`--harness` conflict, layer routing and skip-note, project-path dedupe — no findings, plus a regression pass on the original surface. Untested classes, named per the stop rule: the interactive TTY picker (no real terminal in the build session), and the non-Claude harness paths against *live* installs of those harnesses (paths taken from the vercel-labs/skills CLI map, not verified against each product).

## Confirmation

Design pick "Node CLI via npx" in the structured question served as the gated confirmation. — 2026-07-08
