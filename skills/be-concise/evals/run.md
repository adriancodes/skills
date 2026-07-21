# Run the Be Concise Lean Pilot

Prerequisites: Codex CLI 0.144.1, ChatGPT authentication, and access to `gpt-5.6-sol`.

1. Run `node score.mjs --self-test`.
2. Confirm `matrix.json` and `suite-manifest.json` say `FROZEN` and the manifest hashes pass.
3. Run each behavior case in both arms:

   ```sh
   node run-codex.mjs --case behavior-recommendation --arm prompt
   node run-codex.mjs --case behavior-recommendation --arm skill
   ```

4. Run each trigger case in the installed arm:

   ```sh
   node run-codex.mjs --case trigger-positive-explicit --arm installed
   ```

5. Repeat for every frozen case exactly once. The runner refuses to overwrite evidence.
6. Run `node score.mjs --write` and preserve `results/pilot-verdict.json`.

Every run receives a fresh `HOME` and workspace. Behavior arms do not install repository skills. Trigger runs install all repository skills into the isolated home and count a trigger only when the native command trace reads `be-concise/SKILL.md`.
