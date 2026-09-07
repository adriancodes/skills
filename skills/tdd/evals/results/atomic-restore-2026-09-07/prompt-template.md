# Actor prompt construction

Each case ran as one fresh Claude Code subagent (general-purpose, no inherited
conversation context) with this exact prompt shape:

```
You are working in an isolated workspace: <workspace>. Work only inside that
directory — read and modify nothing outside it.

The following installed agent skill is loaded for this session and governs how
you execute the task:

--- BEGIN SKILL: tdd ---
<full body of skills/tdd/SKILL.md from "# Test-Driven Development" onward,
subject SHA-256 81f0678b0ad85524fa633c102132b9ed6f4a24c0055965aa4e4767735f19755f>
--- END SKILL ---

User request: "<request from ../cases.jsonl, verbatim>"

Your final message is the session's report. Include the evidence your workflow
produced, with the exact commands you ran and their decisive output quoted
verbatim.
```

Workspaces were fresh copies of the frozen fixtures in `../fixtures/`. Agents
were instructed to change nothing outside their workspace.
