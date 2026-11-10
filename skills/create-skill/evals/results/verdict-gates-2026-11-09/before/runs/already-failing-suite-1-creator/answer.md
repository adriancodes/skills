**Verdict: protected.** The existing `test_casefold` catches the reported regression.

- The corrected implementation in [app.py](/Users/user/Documents/Codex/2026-11-08/referenced-chatgpt-conversation-this-is-an/work/creator-regression-comparison/downstream/runs/already-failing-suite-1-creator/project/app.py:2) uses `casefold()`. For the witness `Straße`, it returns `'strasse'`.
- In a disposable copy, I changed only `casefold()` to `lower()`. The same witness returned `'straße'`, and [test_app.py](/Users/user/Documents/Codex/2026-11-08/referenced-chatgpt-conversation-this-is-an/work/creator-regression-comparison/downstream/runs/already-failing-suite-1-creator/project/test_app.py:6) failed on its expected `'strasse'`.
- The README’s command, `python3 -m unittest -v`, exited 1 on both versions. On the corrected version, `test_casefold` passed; an unrelated `test_fixture_version` failed. On the regressed version, both tests failed, including `test_casefold`, which detects this bug.

The disposable diff contained only the `casefold()` → `lower()` reversal. The supplied project was left unchanged.