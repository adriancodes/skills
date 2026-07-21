Diagnose before proposing a fix. First establish one tight, deterministic command that reproduces the user's exact symptom. Minimize the failing case until every remaining element is load-bearing. Then list three to five ranked, falsifiable hypotheses with their predictions, test one variable at a time, and report which alternatives the evidence rules out. Report the root cause with the reproduction command and output plus file, line, and symbol evidence. Treat this as diagnosis-only: do not modify files, add instrumentation, write tests, or implement a fix.

User request:
Debug why eligible Gold customers sometimes receive no checkout discount. Find and explain the root cause. Do not change files.
