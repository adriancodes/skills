# Skills Toolbox

Adrian's personal agent skills, published for anyone to install. A toolbox, not a framework: skills are independent, unified by their author rather than a theme.

## Language

**Toolbox**:
This repo — a personal set of independently useful skills, published via both the skills CLI and the Claude Code plugin marketplace.
_Avoid_: Framework, library, collection

**Generator**:
The meta-skill that authors every skill in the toolbox — developed as skillforge (`adriancodes/skillforge`) and shipped in this repo as `create-skill`. The generator holds the authoring rules; the other skills are its outputs.
_Avoid_: Builder, forge

**Spec session**:
A session run by the `spec-plan` skill — a relentless one-question-at-a-time interview, or a zero-question capture of an earlier conversation — that turns a plan into a confirmed, written spec.
_Avoid_: Grilling, interrogation, distillation, interview session

**Decision log**:
The per-session document a spec session writes incrementally (`docs/specs/<date>-<slug>.md` in the target repo), recording every resolved decision as it lands. The exit gate reads it back for confirmation; interrupted sessions resume from it.
_Avoid_: Design brief, session notes, transcript

**Verification**:
A session run by the `verify-work` skill: rounds of executed adversarial attacks against a finished artifact, each finding patched in the artifact, ending only after two consecutive rounds surface nothing new.
_Avoid_: Testing, QA, review, hardening

**Discipline layer**:
The always-on behavior file (`work-discipline/work-discipline.md`) carrying the rules a baseline model empirically failed — nothing more. Not a skill; installed as an output style or CLAUDE.md content.
_Avoid_: Fable layer, system prompt, persona, style guide

**Soft reference**:
How a toolbox skill mentions another skill: by name, with an inline fallback that works when the other skill isn't installed. The only permitted form of composition between skills.
_Avoid_: Dependency, chain, import
