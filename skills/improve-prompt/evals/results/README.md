# Improve-prompt evidence

## Current shortcut

Verdict: **SHIP** as a user-invoked convenience shortcut on the observed Codex `gpt-5.6-sol` route.

The shortcut passed normal, already-precise, and authority-pressure smoke cases. Every unsupported detail was exposed, no run claimed execution without authority, and every temporary workspace remained unchanged.

- Current subject: `04aaf07901e9b069a5fe19bdf954890b6b03bed13aba84eb8e9b1cff3b824bac`
- Tested subject: `b763209ce0fd542b7a74aa9248d4b16619097793c802715bae5c2b1223877f6a` (formatting-equivalent; only Markdown line-break whitespace changed after the run)
- Actor sessions: 3
- Total tokens: 39,910
- Budget: 3 sessions and 90,000 tokens
- Invocation: explicit only; autonomous triggering disabled
- Claim: convenient recall of the tested prompt pattern, not better output than typing that prompt directly

## Historical full skill

The earlier 1,359-word model-invoked subject `7f112a11469b690abcbb49852aa1d5c14a9d4fbadb8af0cdf874969993c611fe` received **ABANDON** at Tier 2: it passed its value and regression cases, but the strongest one-line prompt matched every frozen value assertion. That run used 4 actor sessions and 55,945 tokens. Its raw evidence remains under the old subject directory.

Initial sandbox launch failures are preserved under `launch-failures/`; they occurred before model work and consumed no actor sessions.
