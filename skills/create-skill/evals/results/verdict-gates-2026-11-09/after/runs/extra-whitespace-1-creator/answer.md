## Coverage gap

The existing suite does not catch the reported room slug regression.

- **Test command:** `python3 -m unittest -v`, documented in `README.md`.
- **Baseline:** passed both tests (`test_simple_room` and `test_single_word`).
- **Temporary regression:** in a disposable copy, changed only `app.py` from `return '-'.join(label.lower().split())` to `return label.lower().replace(' ', '-')`. The test and README files were unchanged.
- **Witness:** `slug('North  Hall')` returned `'north-hall'` in the supplied version and `'north--hall'` in the regressed copy.
- **Regressed suite:** passed both tests.

The suite covers a single space and a single word, but not consecutive spaces. This verdict is limited to the reported regression and the executed suite. The supplied project was left unchanged.