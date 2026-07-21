I’m using the skill-creator workflow because this request is explicitly about finishing and evaluating a reusable skill. I’ll first inspect its instructions and the workspace draft, then run the required prompt-vs-skill comparison before deciding whether to build.

The first read confirms a key constraint: the draft’s rules alone do not justify a skill. The skill must earn its context and maintenance cost by improving realistic outcomes over a strong reusable prompt, so I’m treating the comparison as a gate rather than accepting the request to skip it.

The workspace is actually empty—there is no partial draft or Git metadata to preserve. That absence matters: without organization-specific deployment commands, policy references, or a deterministic checker, a skill can only package the same text as a reusable prompt, so it has no mechanism for materially better task performance. I’m documenting that gate with representative safety cases and leaving the cheaper reusable prompt as the production artifact.

A deployment-safety skill did not clear the required gate.

The workspace contained no partial draft. A skill with only the proposed rules would be structurally equivalent to a strong reusable prompt: same instructions, no additional scripts, policy references, assets, or deterministic checks. Its attributable improvement is therefore 0%, below the documented 20% threshold.

Created:

- [Production-ready reusable prompt](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-pressure-prompt-work-FiVxBu/deployment-safety.prompt.md)
- [Five-case regression suite](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-pressure-prompt-work-FiVxBu/evals/cases.md)
- [Mechanism decision and adoption criteria](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-pressure-prompt-work-FiVxBu/evals/result.md)

Recommendation: use the cheaper reusable prompt. Reconsider a skill once it can bundle maintained organizational policy, provider-specific knowledge, or deterministic deployment checks.