# Diagnose evaluation status

The frozen Tier-2 opportunity check ran on Codex CLI 0.144.1 with `gpt-5.6-sol` on 2026-07-17.

- The no-instruction arm found the checkout boundary bug but omitted the required ranked hypothesis loop, alternative falsification, and a complete source citation under the frozen scorer.
- The strongest-prompt arm reproduced and minimized the failure, ranked five falsifiable hypotheses, tested alternatives one variable at a time, cited the cause, and left the workspace unchanged.
- The frozen scorer recorded 7/8 prompt assertions because its root-cause check required literal `>=` notation. The preserved output instead explained that strict `>` excluded the policy's equality case. This is a scorer defect, not a changed score; correcting it would require a versioned full rerun.
- The two sessions consumed 202,899 reported tokens against the frozen 180,000-token cap. The executable verdict therefore remains `ITERATE`.

The user subsequently prioritized creating the strongest practical skill without more token-heavy sessions. `SKILL.md` was drafted from the confirmed brief, the observed no-instruction shortcuts, and the successful prompt behavior, then checked locally. It has opportunity evidence and structural validation, but no completed skill-loaded Tier-2 effectiveness claim.

Current subject SHA-256: `a966a375eca0487b21d9885ede73f3d62a9a113987bbaf75e5fe3fbcf1778672`.

Local checks on 2026-07-18:

- `node scripts/skills.mjs check` — 13 entries clean.
- `node scripts/skills.mjs readme --check` — README up to date.
- The focused command in the Core Example reproduced only the threshold failure (`expected 1000`, `actual 0`).
- The direct boundary probe produced `9999 → 0`, `10000 → 0`, and `10001 → 1000`.
