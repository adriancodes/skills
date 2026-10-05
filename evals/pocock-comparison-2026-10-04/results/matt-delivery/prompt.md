Apply the supplied instructions to the user request. Inspect and edit the project only inside /var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/skill-quality-pilot-y39TAY. You may read the supplied skill and its references under /Users/adrian/dev/skills/evals/pocock-comparison-2026-10-04/results/matt-delivery/subject; this read-only directory is part of your authorized evaluation input. Do not use external services, install dependencies, or delegate. Do not inspect other evaluation results or the parent repository. Do not invent user replies. Stop if a real user decision is needed.

Instructions:
---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use /code-review to review the work.

Commit your work to the current branch.


Supporting references for this skill, if requested by its body: /Users/adrian/dev/skills/evals/pocock-comparison-2026-10-04/results/matt-delivery/subject. Other skills are unavailable in this evaluation; use the supplied skill's standalone fallback. The issue tracker, if a tracker is needed, is local Markdown under docs/specs/; no external services are authorized.


User request:
Finish the shipping feature end to end from its confirmed spec and confirmed slices. Complete all remaining tasks and verify the feature in this session. Stay within their bounds. Do not commit or publish anything.