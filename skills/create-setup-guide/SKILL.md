---
name: create-setup-guide
description: Use when the user asks "create a setup guide", "write a reusable setup walkthrough", or "make an interactive setup runner" for human-only dashboard, account, or credential steps. Also use when local setup must survive retries, existing configuration, or interrupted manual steps.
license: MIT
metadata:
  category: Delivery
  summary: Creates a source-backed human setup guide and bounded local runner with honest completion and recovery checks.
---

# Create Setup Guide

Generate a repeatable procedure for the human's missing setup steps. Verify only what the available evidence permits.

## Scope

Use when a required action needs human access or reusable onboarding instructions.

Do not use for:

- Performing account, billing, permission, or production changes outside the request.
- Diagnosing application errors: use `diagnose`; reproduce and test causes if unavailable.
- General feature implementation: use `deliver-feature`; implement confirmed scope if unavailable.
- Persistent agent-policy changes: use `write-agent-instructions`; test a minimal justified instruction change if unavailable.

## Workflow

### 1. Establish prerequisites and evidence

Inspect current configuration without displaying secret values.
Read supplied primary setup documents or retrieve applicable current vendor instructions.
Identify the human-only action and required role, environment, and credential type.
Record each captured value's exact destination.
Define completion as separate human confirmations and machine-verifiable checks.
Keep missing access blocked rather than substituting another credential type.

Done when the procedure has source-backed prerequisites, destinations, and completion conditions.

### 2. Write the human guide

Follow repository conventions or use `docs/setup/<topic>.md`.
Give the exact dashboard navigation and required selection.
Explain where each value belongs without requesting secrets in chat.
Separate test, development, and production environments.
Point to applicable source documents and their limits.
State how to retry, cancel, and verify the local result.

Done when a human can perform the unavailable step without guessing its environment or destination.

### 3. Add a runner only when useful

Use existing tooling or the standard library.
Require an actual terminal for hidden secret entry.
Fail closed if hidden input is unavailable.
Require confirmation before replacing an existing target value.
Preserve unrelated configuration, comments, and user work.
Parse existing multiline records with the actual reader or return incomplete before writing.
Use atomic writes and verify the value without printing it.
Match encoding to the application's actual configuration reader.
For local `KEY=value` files, store and read through `scripts/local_env.py`.
Write another encoder only when the application's reader requires a different encoding.
Copy the helper beside the generated runner so the result works independently.
Accept every single-line value the helper can store; never narrow input to an allowed-character list.
Keep prerequisite confirmation separate from merely finding a nonempty key.
Return incomplete status on refusal, invalid input, interruption, or failed verification.
Keep external publication and dashboard execution outside the runner unless explicitly requested.

Done when the runner can complete and retry the requested local steps without secret disclosure or false success.

### 4. Exercise and report

Test with synthetic input and disposable configuration.
Bound subprocess and terminal tests with deadlines.
Cover success, existing values, refusal, blank input, and interruption.
Check that spaces, quotes, `#`, `$`, and backslashes save and read back exactly.
Reject unsupported multiline or ambiguous values explicitly.
Check the actual consumer's round trip when available.
Report local completion separately from unverified vendor validity.

Done when independent replay verifies preservation and failure behavior, with untested conditions explicit.

## Worked example

A missing Sandbox Reader role blocks test-key creation.
Write the owner role-grant step before the human's Sandbox Keys step.
Capture the key through hidden input only after role and sandbox confirmation.
Save it locally while preserving `USER_SETTING`.
On cancellation, return incomplete without replacing an existing key.
A local presence check verifies storage; it does not verify the vendor account or key validity.

## Verification

Check source applicability, manual dependencies, secret destinations, recovery paths, and observed replay.
Keep completion claims within confirmed human steps and actual machine checks.
