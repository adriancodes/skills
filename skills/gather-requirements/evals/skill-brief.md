# Confirmed Skill Brief: gather-requirements

Confirmed by the user on 2026-11-11, through answers and corrections in the session that produced [the SDLC loop spec](../../../docs/specs/2026-11-11-sdlc-loop.md).

- **Problem:** An agent given "build me X" fills the gaps with guesses and builds the wrong thing.
- **Users:** Anyone handing an agent an app, feature, or other piece of work to build.
- **Core job:** Question the user one question at a time until the agent holds everything a spec needs: who it is for, why, what done looks like, what it must do, constraints, and what is out of scope. User: it "systematically walks through and questions the person in order to get all of the information required to create a spec and to have the model fully understand" the request.
- **Questions:** Asked through a friendly multiple-choice UI with optional free-text input. Each carries a best-in-class recommendation; the user makes the final choice. User: "proactively make best in class recommendations but let the user ultimately select their choice".
- **Stop:** User: "when the model determines is confident it has at least 95% clear understanding of the requirements or the user says stop."
- **Output:** A read-back the user confirms. No file.
- **Triggers:** A build request missing something a spec needs; "interview me first", "ask me what you need to know".
- **Non-triggers:** Requests that are already specific; small reversible changes; writing a spec down or stress-testing a plan (`create-spec`); choosing an approach (`create-rfc`); unattended runs.
- **Invocation:** Model-invoked, plus explicit. User chose this over explicit-only, accepting that it will sometimes interview when speed was wanted.
- **Type:** Workflow.
- **Success:** The read-back lets `create-spec` write a spec without re-asking, and no requirement in it was invented by the agent.
- **Evidence:** Tier 1.
- **ASSUMED:** It reads the repository before asking. The 95% bar is backed by the three-part stop test in step 4. An early stop carries unknowns into the read-back as assumptions or open items.
