# Protected

The existing suite catches the reported final newline regression.

- **Test command:** `python3 -m unittest -v` (documented in `README.md`).
- **Baseline:** passed; both tests ran.
- **Disposable regression:** changed only `app.py` from `return len(text.splitlines())` to `return len(text.split('\n'))`. The test file was unchanged.
- **Witness:** `count_lines('alpha\n')` returned `1` with the supplied implementation and `2` with the regressed implementation.
- **Regressed suite:** failed at `test_final_newline` with `AssertionError: 2 != 1`; the other test passed.

The supplied project’s file hashes were unchanged after the check. This verdict covers only the reported regression and the executed suite.