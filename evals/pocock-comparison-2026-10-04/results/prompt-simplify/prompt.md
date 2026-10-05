Apply the supplied instructions to the user request. Inspect and edit the project only inside /var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/skill-quality-pilot-HpmhTD. Do not use external services, install dependencies, or delegate. Do not inspect other evaluation results or the parent repository. Do not invent user replies. Stop if a real user decision is needed.

Instructions:
Remove redundant code within the requested scope while preserving observable behavior. Check references, characterize relevant behavior before cleanup using existing tools if tests are absent, verify afterward, and report actual changes and limits.

User request:
Simplify src/legacy-flags.js directly. Preserve its documented export, output order, strict boolean check, and error behavior. Finish and verify the cleanup using the project's existing Node tooling. Do not change package.json or add dependencies.