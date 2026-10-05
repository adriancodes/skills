I’m applying the supplied TDD skill. I’ll inspect the local changes and shipping contract first, then run a focused failing test before changing production behavior.

Implemented the README contract in `src/shipping.js` and added `test/shipping.test.js`.

- Red: `node --test test/shipping.test.js` failed at 5,000 cents, then separately for missing `TypeError`.
- Green: the same command passed both tests.
- Affected and full suite: `npm test` passed 2/2 tests.

No commit created. Git diff was unavailable because the project has no Git repository.