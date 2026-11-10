// Shared reproducible scorer; evaluation tooling is not a runtime dependency.
process.argv.push("map-decisions");
await import('../../../evals/gap-skills-2026-10-05/score.mjs');
