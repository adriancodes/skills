Parallel subagents are unavailable. This fallback is **anchored, not isolated**.

Use this prompt:

> Propose 10 distinct approaches for running a nightly local CSV report. Constraints: no hosted services, a 10-minute runtime cap, and human approval before publishing results. Cluster approaches by underlying mechanism. For each, explain scheduling, runtime enforcement, and the approval gate. Flag traps with one-line reasons. Rank three viable options by constraint fit, using novelty only to break ties; verify the top pick against every constraint. Mark one novel but viable wild option, or declare it empty. State assumptions explicitly. Stop at the shortlist for a human decision; do not implement or publish anything.