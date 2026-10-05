# Bulletproofing Discipline-Enforcing Skills

Discipline skills enforce rules that agents are tempted to skip under pressure. Standard skills teach HOW to do something. Discipline skills force agents to do something they'd rather rationalize away. They require different engineering.

## When This Guide Applies

Apply these techniques to any skill that:
- Requires the agent to do something BEFORE it can start the "real work" (e.g., write tests first)
- Enforces a process the agent might consider "overhead" (e.g., verification, code review)
- Constrains the agent's natural tendency to take shortcuts (e.g., no force-push, no skipping hooks)

Do NOT apply to technique, reference, or simple workflow skills — overengineering weakens them.

## Why Agents Rationalize

Agents optimize for task completion. When a rule slows them down, they generate plausible-sounding reasons to skip it. These aren't bugs — they're emergent behavior from the optimization pressure. Common triggers:

- **Time pressure**: "The user wants this done quickly"
- **Sunk cost**: "I already wrote the code, writing a test now is redundant"
- **Complexity**: "This case is too complex for the standard process"
- **Spirit vs letter**: "I'm following the intent, not the ritual"
- **Authority**: "The user said 'just fix it', implying skip the process"

## Technique 1: Rationalization Tables

Capture every excuse observed during baseline testing. Format as a table the agent can scan quickly.

```markdown
| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests written after prove nothing about design intent. |
| "This is different because..." | It's not. Follow the process. |
| "I'm following the spirit" | Violating the letter IS violating the spirit. |
| "The user wants it done fast" | Fast and broken is slower than correct and methodical. |
| "I already manually verified it" | Manual verification doesn't persist. Tests do. |
```

### How to Build the Table

1. Run the target scenario with a subagent WITHOUT the skill loaded.
2. Record the exact rationalizations the agent uses (verbatim when possible).
3. Write a direct, specific counter for each.
4. Run again WITH the skill. If new rationalizations appear, add them.
5. Iterate until the agent complies consistently.

## Technique 2: Red Flags Lists

Create a self-check list of thoughts that signal the agent is about to violate the rule. Format these as a "STOP" section.

```markdown
## Red Flags — STOP and Reassess

These thoughts mean the process is about to be violated:

- "This is just a simple change"
- "I already know it works"
- "Testing this would be redundant"
- "The user didn't ask for tests"
- "I can test after I finish"
- "This is different because..."

All of these mean: STOP. Return to step 1 of the workflow.
```

## Technique 3: Explicit Loophole Closing

Don't just state the rule — enumerate and forbid specific workarounds.

### Weak (Exploitable)

```markdown
Write code before the test? Delete it.
```

### Strong (Closed)

```markdown
Write code before the test? Delete it. Start over.

**No exceptions:**
- Do not keep it as "reference"
- Do not "adapt" it while writing tests
- Do not glance at it to "inform" the test
- Delete means delete — from the file, from your plan, from your memory of the approach
```

### Why This Works

Each line closes a specific loophole that agents actually exploit:
- "reference" — keeping deleted code nearby and recreating it
- "adapt" — modifying existing code to match tests, inverting the process
- "glance" — anchoring test design to existing implementation

## Technique 4: Foundational Principles

Place a short, absolute statement early in the skill that cuts off entire classes of rationalization:

```markdown
**Violating the letter of the rules is violating the spirit of the rules.**
```

This single sentence eliminates "spirit vs letter" arguments. Other useful foundational principles:

- "No output without verification."
- "Process discipline IS speed — shortcuts create rework."
- "The rule applies especially when it feels unnecessary."

## Technique 5: Pressure Testing

Test with combined pressures, not just one at a time:

| Pressure Type | Example Scenario |
|--------------|------------------|
| Time | "The user needs this in 5 minutes" |
| Sunk cost | Agent has already written substantial code |
| Complexity | Problem seems too complex for the standard process |
| Authority | User says "just do it, skip the tests" |
| Exhaustion | Agent is deep into a long task and wants to wrap up |

**Combine pressures:** The most realistic test is time + sunk cost + authority simultaneously. An agent that resists one pressure may fold under three.

## Technique 6: Escalation Path

Give the agent a legitimate way to handle genuine edge cases without violating the rule:

```markdown
## Genuine Exceptions

If the rule genuinely cannot be followed (not "seems unnecessary" — genuinely impossible):

1. State explicitly which rule cannot be followed and why
2. State what alternative verification will be performed
3. Document this as a known limitation
4. Proceed with the alternative

**Note:** "It would take too long" is never a genuine exception. "The testing framework cannot express this assertion" may be.
```

This prevents the agent from feeling "trapped" and inventing creative workarounds. It channels edge cases through a visible, auditable path.

## Technique 7: One Job Per Section — Never Restate

Discipline skills accumulate reinforcing sections (Rationalization Table, Red Flags, Common Mistakes, Quick Reference, the closing restatement). The failure mode: the *same* rebuttal gets repeated across all of them, burying the rule in bulk. Repetition reads as thoroughness while writing — and as noise when read under pressure. State each rationalization once; elsewhere, point to it.

| Section | Its one job | Never |
|---------|-------------|-------|
| Rationalization Table | Every excuse → its counter. The full list lives here. | — |
| Red Flags | Short self-check *thoughts* that signal imminent violation. | Re-arguing the counters — name the thought, point to the table |
| Foundational Principle | One absolute sentence, stated once, early. | A paragraph |
| Common Mistakes | Concrete execution errors + fixes. | Restating rationalizations |
| Quick Reference | Situation → action lookup. | Restating rationalizations |
| Closing restatement | One line: the binding rule, end-loaded (position lever). | A second rationalization list |

**Rule:** every rationalization appears once, in the table. The other sections reference it; they never re-argue it.

## Technique 8: Deliver, Don't Lecture

A discipline skill that moralizes gets disabled by the user. The agent must enforce the rule without turning every interaction into a sermon. Add one explicit instruction to the skill:

```markdown
State the rule once, briefly, then produce the compliant version and move on.
Do not lecture. When the user hasn't raised the topic, default to the safe pattern silently.
```

This keeps the discipline invisible when it's working and surfaces it only when genuinely contested — the opposite of nagging.

## Integration Checklist

The required bulletproofing items are owned by `references/rules.md` (Bulletproofing Requirements) and run in Phase 6. This guide explains the techniques behind them; the registry owns the checklist itself — including the final "re-test after hardening" item, which is easy to skip and must not be.
