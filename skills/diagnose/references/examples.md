# Worked example

Request: “The session-expiry test fails on CI now and then. Find out why. Do not change files.”

1. Run a fixed sample of the one test and record the rate:

   ```sh
   for i in $(seq 20); do npm test -- --test-name-pattern="expires idle sessions" >/dev/null 2>&1 || echo fail; done | wc -l
   # 0
   ```

   Alone it never fails. Run the whole file 20 times instead; capture `7/20` failures with `expected expired, actual active`.
2. Minimize with the runner's shuffle seed fixed: the test is red `20/20` directly after “extends a session on activity” and green `20/20` after any other test. Drop every other test; the pair stays red.
3. Rank an advanced shared fake clock, a leaked session store, a real timer racing the assertion, CI load, and time zone as falsifiable hypotheses.
4. Falsify one at a time. A tenfold timeout leaves the pair red, so load and a timer race are out. A neighbor that writes to the store without advancing the clock gives green, so the store is out. A neighbor that only advances the clock gives red.
5. Report the module-level fake clock that “extends a session on activity” advances and never resets as the cause; cite the shared declaration, the `7/20` sample, and the pair results, then stop without editing files.
