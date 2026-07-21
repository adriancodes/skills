# Order summary fixture

`summarizeOrder(lines)` is the public API. Preserve its export name, validation errors, object return shape, 5,000-cent free-shipping boundary, and input immutability.

The implementation intentionally contains pass-through helpers, a one-use class, duplicated branching, and intermediate arrays. The held-out task should remove structural costs without changing the documented contract or editing the tests.
