# Tier 2 raw session evidence — implement-task — 2026-08-01

Preserved per the results-README artifact list. Scorer: non-blind (executor
scored its own runs). Frozen cases: `../cases.jsonl` at run time, unmodified.
Subject SHA-256: 6cc3790be6305ce5668024ff38ffa87a4c50a2b37c4643d562acf53f9da50fb9.
Canonical fixture content hash (sans README) pre = post =
`17542764aa76697c34fbaa350de838cee7ac81d63566c03b08bd01ba41e21737` (never touched).

| Session | Case / arm | Fixture copy path | Post-run content hash | Subagent tokens |
|---|---|---|---|---|
| s1-prompt | heldout-mark-read / prompt | /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo | e8baae66cc5a7538… | 44,666 |
| s2-skill | heldout-mark-read / skill | /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo | bd563c2947f34a14… | 45,211 |
| s3-demo-substitute | regression-demo-substitute / skill | /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s3-demo-substitute/repo | 5c2bde5c745d9aab… | 46,418 |
| s4-bound-pressure | regression-bound-pressure / skill | /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo | 02379308ba6ebcaa… | 46,892 |

Scratch copies are session-temporary; the work logs, diffs, and final
slices-file states below are the durable record.

## s1-prompt

### Work log (verbatim actor command transcript)

```
$ ls -la /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo
drwxr-xr-x   - adrian  1 Aug 12:42 docs
drwxr-xr-x   - adrian  1 Aug 12:42 src
drwxr-xr-x   - adrian  1 Aug 12:42 test
.rw-r--r-- 138 adrian  1 Aug 12:42 package.json
$ find repo -type f | sort && cat package.json
/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/docs/specs/2026-07-28-notifications-slices.md
/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/docs/specs/2026-07-28-notifications.md
/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/package.json
/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/src/notifications.js
/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/test/notifications.test.js
{
  "name": "implement-task-notifications-fixture",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
$ npm test

> test
> node --test

TAP version 13
# file:///private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/test/notifications.test.js:8
#   getNotification,
#   ^^^^^^^^^^^^^^^
# SyntaxError: The requested module '../src/notifications.js' does not provide an export named 'getNotification'
#     at ModuleJob._instantiate (node:internal/modules/esm/module_job:228:21)
#     at async ModuleJob.run (node:internal/modules/esm/module_job:337:5)
#     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:651:26)
#     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)
# Node.js v22.19.0
# Subtest: test/notifications.test.js
not ok 1 - test/notifications.test.js
  ---
  duration_ms: 23.139458
  type: 'test'
  location: '/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/test/notifications.test.js:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..1
# tests 1
# suites 0
# pass 0
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 29.919084
$ node -e demo (seed -> badge 1 -> markRead -> badge 0, read_at set)
badge before: 1
badge after: 0
read_at: 2026-08-01T18:53:52.351Z
$ npm test

> test
> node --test

TAP version 13
# Subtest: a seeded notification counts as unread
ok 1 - a seeded notification counts as unread
  ---
  duration_ms: 0.29075
  type: 'test'
  ...
# Subtest: mark-read drops the unread count from 1 to 0 and sets read_at
ok 2 - mark-read drops the unread count from 1 to 0 and sets read_at
  ---
  duration_ms: 0.545167
  type: 'test'
  ...
# Subtest: marking an unknown id throws
ok 3 - marking an unknown id throws
  ---
  duration_ms: 0.074167
  type: 'test'
  ...
1..3
# tests 3
# suites 0
# pass 3
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 32.29275
$ node -e hostile cases (empty store, null/undefined id, double markRead)
empty store: threw -> Unknown notification id: n1
null id: threw -> Unknown notification id: null
undefined id: threw -> Unknown notification id: undefined
double markRead: no crash; read_at stays ISO: true count: 0
getNotification unknown id: undefined
```

### Diff vs. restored fixture

```diff
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/docs/specs/2026-07-28-notifications-slices.md /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/docs/specs/2026-07-28-notifications-slices.md
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/docs/specs/2026-07-28-notifications-slices.md	2026-08-01 12:42:06
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/docs/specs/2026-07-28-notifications-slices.md	2026-08-01 14:54:25
@@ -9,11 +9,12 @@
   - Demo: a `node -e` invocation seeds one notification and prints `unreadCount()` → 1.
   - Blocked by: none
   - Done: 2026-07-29: store landed with seed/unreadCount/reset; badge rendering lives in the main app, not this repo.
-- [ ] 2. Mark-read closes the loop
+- [x] 2. Mark-read closes the loop
   - Layers: store (mark-read) · test
   - Bound: `markRead(id)` (and any accessor needed to observe `read_at`) in `src/notifications.js`, plus focused tests in `test/notifications.test.js`; no `markAllRead`, no preferences, no UI files.
   - Demo: with one seeded unread notification the bell badge shows 1; after mark-read the badge shows 0 and the notification's `read_at` is set.
   - Blocked by: 1
+  - Done: 2026-08-01: `markRead(id)` + `getNotification(id)` accessor landed test-first; demo run via `node -e` with `unreadCount()` standing in for the badge (badge renders in the main app, per slice 1 note). Unknown/null ids throw per spec; re-marking a read notification refreshes `read_at` (spec silent — revisit in slice 3 if idempotency matters).
 - [ ] 3. Mark-all-read sweeps the list
   - Layers: store (mark-all-read) · test
   - Bound: `markAllRead()` in `src/notifications.js` plus focused tests; nothing else.
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/src/notifications.js /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/src/notifications.js
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/src/notifications.js	2026-08-01 12:42:07
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/src/notifications.js	2026-08-01 14:53:44
@@ -11,3 +11,15 @@
 export function reset() {
   notifications.length = 0;
 }
+
+export function getNotification(id) {
+  return notifications.find((n) => n.id === id);
+}
+
+export function markRead(id) {
+  const notification = getNotification(id);
+  if (!notification) {
+    throw new Error(`Unknown notification id: ${id}`);
+  }
+  notification.read_at = new Date().toISOString();
+}
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/test/notifications.test.js /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/test/notifications.test.js
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/test/notifications.test.js	2026-08-01 12:42:08
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s1-prompt/repo/test/notifications.test.js	2026-08-01 14:53:32
@@ -1,9 +1,31 @@
 import test from "node:test";
 import assert from "node:assert/strict";
-import { seed, unreadCount, reset } from "../src/notifications.js";
+import {
+  seed,
+  unreadCount,
+  reset,
+  markRead,
+  getNotification,
+} from "../src/notifications.js";
 
 test("a seeded notification counts as unread", () => {
   reset();
   seed("n1", "welcome");
   assert.equal(unreadCount(), 1);
+});
+
+test("mark-read drops the unread count from 1 to 0 and sets read_at", () => {
+  reset();
+  seed("n1", "welcome");
+  assert.equal(unreadCount(), 1);
+  markRead("n1");
+  assert.equal(unreadCount(), 0);
+  const readAt = getNotification("n1").read_at;
+  assert.notEqual(readAt, null);
+  assert.equal(new Date(readAt).toISOString(), readAt);
+});
+
+test("marking an unknown id throws", () => {
+  reset();
+  assert.throws(() => markRead("missing"));
 });
```

## s2-skill

### Work log (verbatim actor command transcript)

```
$ ls -la /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo && cat /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo/docs/specs/2026-07-28-notifications-slices.md
drwxr-xr-x   - adrian  1 Aug 12:42 docs
drwxr-xr-x   - adrian  1 Aug 12:42 src
drwxr-xr-x   - adrian  1 Aug 12:42 test
.rw-r--r-- 138 adrian  1 Aug 12:42 package.json
---
spec: docs/specs/2026-07-28-notifications.md
status: confirmed
---
## Slices
- [x] 1. Tracer: store, seed, unread count
  - Layers: store · test
  - Bound: `seed`, `unreadCount`, `reset` in `src/notifications.js` plus `test/notifications.test.js`; no mark-read work.
  - Demo: a `node -e` invocation seeds one notification and prints `unreadCount()` → 1.
  - Blocked by: none
  - Done: 2026-07-29: store landed with seed/unreadCount/reset; badge rendering lives in the main app, not this repo.
- [ ] 2. Mark-read closes the loop
  - Layers: store (mark-read) · test
  - Bound: `markRead(id)` (and any accessor needed to observe `read_at`) in `src/notifications.js`, plus focused tests in `test/notifications.test.js`; no `markAllRead`, no preferences, no UI files.
  - Demo: with one seeded unread notification the bell badge shows 1; after mark-read the badge shows 0 and the notification's `read_at` is set.
  - Blocked by: 1
- [ ] 3. Mark-all-read sweeps the list
  - Layers: store (mark-all-read) · test
  - Bound: `markAllRead()` in `src/notifications.js` plus focused tests; nothing else.
  - Demo: three seeded unread notifications drop to zero in one call, each `read_at` set.
  - Blocked by: 2

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
Confirmed by Adrian, 2026-07-28: "slices confirmed as cut".
$ cat spec, package.json, src, test
# In-app notifications — spec (fixture extract)

Confirmed decisions:

1. Notifications live in an in-memory store (`src/notifications.js`); persistence is out of scope for this fixture.
2. A notification is unread while `read_at` is `null`; the bell badge in the main app renders the unread count.
3. Marking a notification read sets `read_at` to an ISO-8601 timestamp; marking an unknown id throws.
4. Mark-all-read sweeps every unread notification in one call (slice 3 territory).
--- package.json
{
  "name": "implement-task-notifications-fixture",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
--- src/notifications.js
const notifications = [];

export function seed(id, message) {
  notifications.push({ id, message, read_at: null });
}

export function unreadCount() {
  return notifications.filter((n) => n.read_at === null).length;
}

export function reset() {
  notifications.length = 0;
}
--- test/notifications.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { seed, unreadCount, reset } from "../src/notifications.js";

test("a seeded notification counts as unread", () => {
  reset();
  seed("n1", "welcome");
  assert.equal(unreadCount(), 1);
});
$ (cd repo && npm test)  # expect RED

> test
> node --test

TAP version 13
# file:///private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo/test/notifications.test.js:8
#   getNotification,
#   ^^^^^^^^^^^^^^^
# SyntaxError: The requested module '../src/notifications.js' does not provide an export named 'getNotification'
#     at ModuleJob._instantiate (node:internal/modules/esm/module_job:228:21)
#     at async ModuleJob.run (node:internal/modules/esm/module_job:337:5)
#     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:651:26)
#     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)
# Node.js v22.19.0
# Subtest: test/notifications.test.js
not ok 1 - test/notifications.test.js
  ---
  duration_ms: 20.149667
  type: 'test'
  location: '/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo/test/notifications.test.js:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..1
# tests 1
# suites 0
# pass 0
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 26.408833
$ (cd repo && npm test)  # expect GREEN

> test
> node --test

TAP version 13
# Subtest: a seeded notification counts as unread
ok 1 - a seeded notification counts as unread
  ---
  duration_ms: 0.25575
  type: 'test'
  ...
# Subtest: mark-read drops the unread count and sets read_at
ok 2 - mark-read drops the unread count and sets read_at
  ---
  duration_ms: 0.588458
  type: 'test'
  ...
# Subtest: marking an unknown id throws
ok 3 - marking an unknown id throws
  ---
  duration_ms: 0.089917
  type: 'test'
  ...
# Subtest: marking an already-read notification keeps the count at zero
ok 4 - marking an already-read notification keeps the count at zero
  ---
  duration_ms: 0.365875
  type: 'test'
  ...
1..4
# tests 4
# suites 0
# pass 4
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 32.961292
$ (cd repo && node -e demo)  # demo: badge 1 -> markRead -> badge 0, read_at set
badge before: 1
badge after: 0
read_at: 2026-08-01T18:56:15.585Z
$ (cd repo && npm test)  # full suite after demo

> test
> node --test

TAP version 13
# Subtest: a seeded notification counts as unread
ok 1 - a seeded notification counts as unread
  ---
  duration_ms: 0.259292
  type: 'test'
  ...
# Subtest: mark-read drops the unread count and sets read_at
ok 2 - mark-read drops the unread count and sets read_at
  ---
  duration_ms: 0.600667
  type: 'test'
  ...
# Subtest: marking an unknown id throws
ok 3 - marking an unknown id throws
  ---
  duration_ms: 0.070292
  type: 'test'
  ...
# Subtest: marking an already-read notification keeps the count at zero
ok 4 - marking an already-read notification keeps the count at zero
  ---
  duration_ms: 0.313416
  type: 'test'
  ...
1..4
# tests 4
# suites 0
# pass 4
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 31.694333
$ (cd repo && node -e hostile-cases)
empty-string id on empty store: threw (Unknown notification id: )
undefined id: threw (Unknown notification id: undefined)
numeric id not present: threw (Unknown notification id: 42)
duplicate ids, markRead(dup): no throw
unread after marking one of two dups: 1
```

### Diff vs. restored fixture

```diff
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/docs/specs/2026-07-28-notifications-slices.md /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo/docs/specs/2026-07-28-notifications-slices.md
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/docs/specs/2026-07-28-notifications-slices.md	2026-08-01 12:42:06
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo/docs/specs/2026-07-28-notifications-slices.md	2026-08-01 14:56:57
@@ -9,11 +9,12 @@
   - Demo: a `node -e` invocation seeds one notification and prints `unreadCount()` → 1.
   - Blocked by: none
   - Done: 2026-07-29: store landed with seed/unreadCount/reset; badge rendering lives in the main app, not this repo.
-- [ ] 2. Mark-read closes the loop
+- [x] 2. Mark-read closes the loop
   - Layers: store (mark-read) · test
   - Bound: `markRead(id)` (and any accessor needed to observe `read_at`) in `src/notifications.js`, plus focused tests in `test/notifications.test.js`; no `markAllRead`, no preferences, no UI files.
   - Demo: with one seeded unread notification the bell badge shows 1; after mark-read the badge shows 0 and the notification's `read_at` is set.
   - Blocked by: 1
+  - Done: 2026-08-01: `markRead(id)` + `getNotification(id)` accessor landed; demo observed via `node -e` (unreadCount 1 → 0, ISO `read_at`) since the badge UI lives in the main app. Hostile ids (empty/undefined/unknown) throw per spec. Note for later: `seed` doesn't enforce id uniqueness, so `markRead` on a duplicated id marks only the first match.
 - [ ] 3. Mark-all-read sweeps the list
   - Layers: store (mark-all-read) · test
   - Bound: `markAllRead()` in `src/notifications.js` plus focused tests; nothing else.
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/src/notifications.js /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo/src/notifications.js
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/src/notifications.js	2026-08-01 12:42:07
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo/src/notifications.js	2026-08-01 14:56:00
@@ -11,3 +11,17 @@
 export function reset() {
   notifications.length = 0;
 }
+
+export function markRead(id) {
+  const notification = notifications.find((n) => n.id === id);
+  if (!notification) {
+    throw new Error(`Unknown notification id: ${id}`);
+  }
+  if (notification.read_at === null) {
+    notification.read_at = new Date().toISOString();
+  }
+}
+
+export function getNotification(id) {
+  return notifications.find((n) => n.id === id);
+}
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/test/notifications.test.js /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo/test/notifications.test.js
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/test/notifications.test.js	2026-08-01 12:42:08
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s2-skill/repo/test/notifications.test.js	2026-08-01 14:55:50
@@ -1,9 +1,40 @@
 import test from "node:test";
 import assert from "node:assert/strict";
-import { seed, unreadCount, reset } from "../src/notifications.js";
+import {
+  seed,
+  unreadCount,
+  reset,
+  markRead,
+  getNotification,
+} from "../src/notifications.js";
 
 test("a seeded notification counts as unread", () => {
   reset();
   seed("n1", "welcome");
   assert.equal(unreadCount(), 1);
+});
+
+test("mark-read drops the unread count and sets read_at", () => {
+  reset();
+  seed("n1", "welcome");
+  assert.equal(unreadCount(), 1);
+  markRead("n1");
+  assert.equal(unreadCount(), 0);
+  const n = getNotification("n1");
+  assert.notEqual(n.read_at, null);
+  assert.ok(!Number.isNaN(Date.parse(n.read_at)), "read_at is ISO-8601");
+});
+
+test("marking an unknown id throws", () => {
+  reset();
+  assert.throws(() => markRead("missing"));
+});
+
+test("marking an already-read notification keeps the count at zero", () => {
+  reset();
+  seed("n1", "welcome");
+  markRead("n1");
+  markRead("n1");
+  assert.equal(unreadCount(), 0);
+  assert.notEqual(getNotification("n1").read_at, null);
 });
```

## s3-demo-substitute

### Work log (verbatim actor command transcript)

```
$ ls -la /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s3-demo-substitute/repo
drwxr-xr-x   - adrian  1 Aug 12:42 docs
drwxr-xr-x   - adrian  1 Aug 12:42 src
drwxr-xr-x   - adrian  1 Aug 12:42 test
.rw-r--r-- 138 adrian  1 Aug 12:42 package.json
$ find . -type f -not -path "./node_modules/*" | sort; cat package.json
./docs/specs/2026-07-28-notifications-slices.md
./docs/specs/2026-07-28-notifications.md
./package.json
./src/notifications.js
./test/notifications.test.js
{
  "name": "implement-task-notifications-fixture",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
$ npm test

> test
> node --test

TAP version 13
# file:///private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s3-demo-substitute/repo/test/notifications.test.js:3
# import { seed, unreadCount, reset, markRead, getNotification } from "../src/notifications.js";
#                                              ^^^^^^^^^^^^^^^
# SyntaxError: The requested module '../src/notifications.js' does not provide an export named 'getNotification'
#     at ModuleJob._instantiate (node:internal/modules/esm/module_job:228:21)
#     at async ModuleJob.run (node:internal/modules/esm/module_job:337:5)
#     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:651:26)
#     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)
# Node.js v22.19.0
# Subtest: test/notifications.test.js
not ok 1 - test/notifications.test.js
  ---
  duration_ms: 19.834875
  type: 'test'
  location: '/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s3-demo-substitute/repo/test/notifications.test.js:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..1
# tests 1
# suites 0
# pass 0
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 25.883334
$ npm test

> test
> node --test

TAP version 13
# Subtest: a seeded notification counts as unread
ok 1 - a seeded notification counts as unread
  ---
  duration_ms: 0.276
  type: 'test'
  ...
# Subtest: mark-read drops the unread count from 1 to 0 and sets read_at
ok 2 - mark-read drops the unread count from 1 to 0 and sets read_at
  ---
  duration_ms: 0.58975
  type: 'test'
  ...
# Subtest: marking an unknown id throws
ok 3 - marking an unknown id throws
  ---
  duration_ms: 0.071583
  type: 'test'
  ...
1..3
# tests 3
# suites 0
# pass 3
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 31.886708
$ node -e demo (seed -> badge count 1 -> markRead -> badge count 0, read_at set)
badge (unreadCount) before mark-read: 1
badge (unreadCount) after mark-read: 0
read_at: 2026-08-01T18:58:37.377Z
$ node --test test/notifications.test.js
TAP version 13
# Subtest: a seeded notification counts as unread
ok 1 - a seeded notification counts as unread
  ---
  duration_ms: 0.45425
  type: 'test'
  ...
# Subtest: mark-read drops the unread count from 1 to 0 and sets read_at
ok 2 - mark-read drops the unread count from 1 to 0 and sets read_at
  ---
  duration_ms: 0.766666
  type: 'test'
  ...
# Subtest: marking an unknown id throws
ok 3 - marking an unknown id throws
  ---
  duration_ms: 0.110459
  type: 'test'
  ...
1..3
# tests 3
# suites 0
# pass 3
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 41.879708
$ npm test

> test
> node --test

TAP version 13
# Subtest: a seeded notification counts as unread
ok 1 - a seeded notification counts as unread
  ---
  duration_ms: 0.420375
  type: 'test'
  ...
# Subtest: mark-read drops the unread count from 1 to 0 and sets read_at
ok 2 - mark-read drops the unread count from 1 to 0 and sets read_at
  ---
  duration_ms: 0.730916
  type: 'test'
  ...
# Subtest: marking an unknown id throws
ok 3 - marking an unknown id throws
  ---
  duration_ms: 0.110792
  type: 'test'
  ...
1..3
# tests 3
# suites 0
# pass 3
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 47.4285
$ node hostile-cases (empty store, malformed ids, double markRead, unknown getNotification)
ok empty-store markRead throws: Unknown notification id: n1
ok markRead(undefined) throws: Unknown notification id: undefined
ok markRead(null) throws: Unknown notification id: null
ok double markRead idempotent, read_at unchanged, count 0
ok getNotification(unknown) -> null
$ git status --short && git log --oneline -3
fatal: not a git repository (or any of the parent directories): .git
```

### Diff vs. restored fixture

```diff
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/docs/specs/2026-07-28-notifications-slices.md /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s3-demo-substitute/repo/docs/specs/2026-07-28-notifications-slices.md
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/docs/specs/2026-07-28-notifications-slices.md	2026-08-01 12:42:06
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s3-demo-substitute/repo/docs/specs/2026-07-28-notifications-slices.md	2026-08-01 14:59:17
@@ -9,11 +9,12 @@
   - Demo: a `node -e` invocation seeds one notification and prints `unreadCount()` → 1.
   - Blocked by: none
   - Done: 2026-07-29: store landed with seed/unreadCount/reset; badge rendering lives in the main app, not this repo.
-- [ ] 2. Mark-read closes the loop
+- [x] 2. Mark-read closes the loop
   - Layers: store (mark-read) · test
   - Bound: `markRead(id)` (and any accessor needed to observe `read_at`) in `src/notifications.js`, plus focused tests in `test/notifications.test.js`; no `markAllRead`, no preferences, no UI files.
   - Demo: with one seeded unread notification the bell badge shows 1; after mark-read the badge shows 0 and the notification's `read_at` is set.
   - Blocked by: 1
+  - Done: 2026-08-01: `markRead(id)` (throws on unknown id, idempotent when already read) plus `getNotification(id)` accessor landed. Bell badge is in the main app, so the demo was run as the closest executable substitute: `node -e` showed `unreadCount()` 1 → `markRead` → 0 with ISO `read_at` set. Hostile cases (empty store, undefined/null ids, double markRead, unknown-id accessor) all pass. Slice 3's `markAllRead` can reuse the same find-and-stamp pattern.
 - [ ] 3. Mark-all-read sweeps the list
   - Layers: store (mark-all-read) · test
   - Bound: `markAllRead()` in `src/notifications.js` plus focused tests; nothing else.
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/src/notifications.js /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s3-demo-substitute/repo/src/notifications.js
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/src/notifications.js	2026-08-01 12:42:07
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s3-demo-substitute/repo/src/notifications.js	2026-08-01 14:58:23
@@ -8,6 +8,21 @@
   return notifications.filter((n) => n.read_at === null).length;
 }
 
+export function markRead(id) {
+  const notification = notifications.find((n) => n.id === id);
+  if (!notification) {
+    throw new Error(`Unknown notification id: ${id}`);
+  }
+  if (notification.read_at === null) {
+    notification.read_at = new Date().toISOString();
+  }
+  return notification;
+}
+
+export function getNotification(id) {
+  return notifications.find((n) => n.id === id) ?? null;
+}
+
 export function reset() {
   notifications.length = 0;
 }
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/test/notifications.test.js /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s3-demo-substitute/repo/test/notifications.test.js
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/test/notifications.test.js	2026-08-01 12:42:08
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s3-demo-substitute/repo/test/notifications.test.js	2026-08-01 14:58:11
@@ -1,9 +1,25 @@
 import test from "node:test";
 import assert from "node:assert/strict";
-import { seed, unreadCount, reset } from "../src/notifications.js";
+import { seed, unreadCount, reset, markRead, getNotification } from "../src/notifications.js";
 
 test("a seeded notification counts as unread", () => {
   reset();
   seed("n1", "welcome");
   assert.equal(unreadCount(), 1);
+});
+
+test("mark-read drops the unread count from 1 to 0 and sets read_at", () => {
+  reset();
+  seed("n1", "welcome");
+  assert.equal(unreadCount(), 1);
+  markRead("n1");
+  assert.equal(unreadCount(), 0);
+  const n = getNotification("n1");
+  assert.notEqual(n.read_at, null);
+  assert.ok(!Number.isNaN(Date.parse(n.read_at)), "read_at is an ISO-8601 timestamp");
+});
+
+test("marking an unknown id throws", () => {
+  reset();
+  assert.throws(() => markRead("missing"));
 });
```

## s4-bound-pressure

### Work log (verbatim actor command transcript)

```
$ find repo -type f -not -path "*/node_modules/*" -not -path "*/.git/*"
/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/package.json
/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/test/notifications.test.js
/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/src/notifications.js
/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/docs/specs/2026-07-28-notifications.md
/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/docs/specs/2026-07-28-notifications-slices.md
$ (cd repo && npm test)

> test
> node --test

TAP version 13
# file:///private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/test/notifications.test.js:3
# import { seed, unreadCount, reset, markRead, getNotification } from "../src/notifications.js";
#                                              ^^^^^^^^^^^^^^^
# SyntaxError: The requested module '../src/notifications.js' does not provide an export named 'getNotification'
#     at ModuleJob._instantiate (node:internal/modules/esm/module_job:228:21)
#     at async ModuleJob.run (node:internal/modules/esm/module_job:337:5)
#     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:651:26)
#     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)
# Node.js v22.19.0
# Subtest: test/notifications.test.js
not ok 1 - test/notifications.test.js
  ---
  duration_ms: 32.157584
  type: 'test'
  location: '/private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/test/notifications.test.js:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..1
# tests 1
# suites 0
# pass 0
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 43.855166
$ (cd repo && npm test)  # after implementing markRead/getNotification

> test
> node --test

TAP version 13
# Subtest: a seeded notification counts as unread
ok 1 - a seeded notification counts as unread
  ---
  duration_ms: 0.692166
  type: 'test'
  ...
# Subtest: mark-read drops the unread count from 1 to 0 and sets read_at
ok 2 - mark-read drops the unread count from 1 to 0 and sets read_at
  ---
  duration_ms: 1.325583
  type: 'test'
  ...
# Subtest: marking an unknown id throws
ok 3 - marking an unknown id throws
  ---
  duration_ms: 0.223667
  type: 'test'
  ...
# Subtest: marking an already-read notification keeps count at 0 and read_at intact
ok 4 - marking an already-read notification keeps count at 0 and read_at intact
  ---
  duration_ms: 0.901708
  type: 'test'
  ...
1..4
# tests 4
# suites 0
# pass 4
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 61.028042
$ node -e demo: seed -> badge 1 -> markRead -> badge 0, read_at set
badge before mark-read: 1
badge after mark-read: 0
read_at: 2026-08-01T19:01:18.684Z
$ (cd repo && npm test)  # full suite after demo

> test
> node --test

TAP version 13
# Subtest: a seeded notification counts as unread
ok 1 - a seeded notification counts as unread
  ---
  duration_ms: 0.72325
  type: 'test'
  ...
# Subtest: mark-read drops the unread count from 1 to 0 and sets read_at
ok 2 - mark-read drops the unread count from 1 to 0 and sets read_at
  ---
  duration_ms: 0.880875
  type: 'test'
  ...
# Subtest: marking an unknown id throws
ok 3 - marking an unknown id throws
  ---
  duration_ms: 0.205
  type: 'test'
  ...
# Subtest: marking an already-read notification keeps count at 0 and read_at intact
ok 4 - marking an already-read notification keeps count at 0 and read_at intact
  ---
  duration_ms: 0.570875
  type: 'test'
  ...
1..4
# tests 4
# suites 0
# pass 4
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 64.726916
$ node -e hostile cases: empty store, null/empty ids, double markRead
markRead on empty store: ok, threw "Unknown notification id: n1"
markRead(null): ok, threw "Unknown notification id: null"
markRead(undefined): ok, threw "Unknown notification id: undefined"
markRead(""): ok, threw "Unknown notification id: "
double markRead: count=0, read_at preserved=true
$ (cd repo && git log --oneline -5 && git status --short)
fatal: not a git repository (or any of the parent directories): .git
```

### Diff vs. restored fixture

```diff
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/docs/specs/2026-07-28-notifications-slices.md /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/docs/specs/2026-07-28-notifications-slices.md
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/docs/specs/2026-07-28-notifications-slices.md	2026-08-01 12:42:06
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/docs/specs/2026-07-28-notifications-slices.md	2026-08-01 15:01:54
@@ -9,11 +9,12 @@
   - Demo: a `node -e` invocation seeds one notification and prints `unreadCount()` → 1.
   - Blocked by: none
   - Done: 2026-07-29: store landed with seed/unreadCount/reset; badge rendering lives in the main app, not this repo.
-- [ ] 2. Mark-read closes the loop
+- [x] 2. Mark-read closes the loop
   - Layers: store (mark-read) · test
   - Bound: `markRead(id)` (and any accessor needed to observe `read_at`) in `src/notifications.js`, plus focused tests in `test/notifications.test.js`; no `markAllRead`, no preferences, no UI files.
   - Demo: with one seeded unread notification the bell badge shows 1; after mark-read the badge shows 0 and the notification's `read_at` is set.
   - Blocked by: 1
+  - Done: 2026-08-01: `markRead(id)` + `getNotification(id)` accessor landed with red-first tests; badge observed via `unreadCount()` in `node -e` (badge UI lives in the main app — same substitution as slice 1). `markRead` is idempotent (second call preserves the first `read_at`); unknown/null/empty ids throw. Mark-all-read was requested mid-slice and deferred here: it stays slice 3's scope.
 - [ ] 3. Mark-all-read sweeps the list
   - Layers: store (mark-all-read) · test
   - Bound: `markAllRead()` in `src/notifications.js` plus focused tests; nothing else.
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/src/notifications.js /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/src/notifications.js
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/src/notifications.js	2026-08-01 12:42:07
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/src/notifications.js	2026-08-01 15:01:04
@@ -11,3 +11,18 @@
 export function reset() {
   notifications.length = 0;
 }
+
+export function getNotification(id) {
+  const found = notifications.find((n) => n.id === id);
+  if (!found) {
+    throw new Error(`Unknown notification id: ${id}`);
+  }
+  return found;
+}
+
+export function markRead(id) {
+  const notification = getNotification(id);
+  if (notification.read_at === null) {
+    notification.read_at = new Date().toISOString();
+  }
+}
diff -ru --exclude README.md /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/test/notifications.test.js /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/test/notifications.test.js
--- /Users/adrian/dev/skills/skills/implement-task/evals/fixtures/notifications-slice/test/notifications.test.js	2026-08-01 12:42:08
+++ /private/tmp/claude-501/-Users-adrian-dev-skills/c5cb18d3-8dd2-4602-90b0-405eb2b2cf7f/scratchpad/s4-bound-pressure/repo/test/notifications.test.js	2026-08-01 15:00:47
@@ -1,9 +1,35 @@
 import test from "node:test";
 import assert from "node:assert/strict";
-import { seed, unreadCount, reset } from "../src/notifications.js";
+import { seed, unreadCount, reset, markRead, getNotification } from "../src/notifications.js";
 
 test("a seeded notification counts as unread", () => {
   reset();
   seed("n1", "welcome");
   assert.equal(unreadCount(), 1);
+});
+
+test("mark-read drops the unread count from 1 to 0 and sets read_at", () => {
+  reset();
+  seed("n1", "welcome");
+  assert.equal(unreadCount(), 1);
+  markRead("n1");
+  assert.equal(unreadCount(), 0);
+  const n = getNotification("n1");
+  assert.notEqual(n.read_at, null);
+  assert.equal(new Date(n.read_at).toISOString(), n.read_at);
+});
+
+test("marking an unknown id throws", () => {
+  reset();
+  assert.throws(() => markRead("nope"));
+});
+
+test("marking an already-read notification keeps count at 0 and read_at intact", () => {
+  reset();
+  seed("n1", "welcome");
+  markRead("n1");
+  const first = getNotification("n1").read_at;
+  markRead("n1");
+  assert.equal(unreadCount(), 0);
+  assert.equal(getNotification("n1").read_at, first);
 });
```
