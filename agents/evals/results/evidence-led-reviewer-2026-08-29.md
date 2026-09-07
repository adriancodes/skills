# Evidence-led reviewer pilot

**Evidence correction — 2026-09-04: UNVERIFIED historical observations.** The raw actor outputs, tool traces, route metadata, and assertion-level scoring needed to audit these counts are unavailable in the repository. The original reported observations remain below for provenance; they are not accepted PASS evidence. Recover the originals or rerun the frozen cases before making a current behavioral claim.

## Direct invocation with `code-review`

Reported result: **6/6; UNVERIFIED**.

The reviewer led with one P1 cross-tenant authorization defect. It cited `candidate-auth.js:3`, reproduced export of `ws-b` by a requester belonging only to `ws-a`, connected that behavior to the required cross-tenant `404`, proposed restoring the membership check, and reported scope, checks, unavailable evidence, and residual risk. It made no edits, nits, praise section, or persona-to-persona call.

## Inline fallback without `code-review`

Reported result: **6/6; UNVERIFIED**.

A fresh agent loaded only the persona and tenant-export fixture. It did not read `code-review`. The report led with the authorization finding, demonstrated a `200` cross-tenant export, cited the deleted membership check and required `404`, proposed the correction, stayed read-only, omitted nits, and ended with scope, checks, unavailable evidence, and residual risk. The inline fallback was reported sufficient for this case; retained material cannot independently verify that claim.

## False invocation

The repository exposes no autonomous persona router. Personas load only when the user or harness selects them, so unrelated skill requests cannot trigger this persona through the root skill routing command. This proves the repository boundary, not behavior in a future harness that independently auto-discovers `agents/*.md`.
