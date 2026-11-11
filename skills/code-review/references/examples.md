# Worked examples

Two calibration cases where the correct report has no finding.

## Pre-existing defect the diff does not worsen

Scoped diff:

```diff
 export function loadProfile(id, cache) {
-  const p = cache.get(id);
+  const profile = cache.get(id);
-  return p.displayName.trim();
+  return profile.displayName.trim();
 }
```

A cache miss throws on `profile.displayName`. The base throws the same way on the same input, so the rename neither introduces nor worsens it. Drop the candidate and report:

> No findings.
>
> Scope: `git diff main...HEAD`, 1 file. Contracts: none stated; Spec lens unavailable. Checks: none run.
> Residual risk: `loadProfile` throws on a cache miss. This predates the diff and is outside its scope.

## Clean diff with tempting smells

Scoped diff:

```diff
-export function shippingCost(weightKg) {
-  return weightKg > 20 ? 15 + (weightKg - 20) * 0.5 : 15;
-}
+const calc = (w) => (w > 20 ? 15 + (w - 20) * 0.5 : 15);
+export function shippingCost(weightKg) {
+  return calc(weightKg);
+}
```

The helper has a vague name, a single-letter parameter, and unnamed numbers. Outputs are identical for every input, and no repository rule covers naming or constants. None of these has a consequence, so none is a finding:

> No findings.
>
> Scope: staged changes, 1 file. Contracts: `test/shipping.test.js`. Checks: `npm test -- shipping` passed.
> Residual risk: none identified.
