Best target: Plain coding task — diagnose and improve authentication error handling and messaging.

Improved prompt:

> Improve authentication error messages in the existing codebase.
>
> [assumed: Review the current authentication flow and identify errors that are vague, misleading, overly technical, or handled inconsistently.]
>
> Update the relevant error handling so users receive clear, actionable messages while sensitive security details remain hidden. Distinguish common cases where the application can reliably identify them, such as:
>
> - Invalid credentials
> - Expired or invalid sessions
> - Insufficient permissions
> - Account restrictions
> - Network or authentication-service failures
> - Unexpected authentication failures
>
> [assumed: Preserve existing authentication behavior, APIs, and UI patterns unless a change is necessary to improve clarity.]
>
> Add or update tests covering the revised error cases. Run the relevant test suite and summarize:
>
> 1. Which files changed
> 2. Which messages or behaviors improved
> 3. What validation was performed
> 4. Any authentication errors that remain intentionally generic for security reasons
>
> Do not expose passwords, tokens, account-existence information, stack traces, or internal service details in user-facing messages.
>
> [assumed: Implement the changes, rather than only recommending wording.]

Assumptions:

- The coding agent can inspect an existing codebase.
- “Clearer” means understandable, actionable, and consistent.
- The request covers both user-facing messages and the logic that maps authentication failures to them.
- Existing behavior and interfaces should remain stable where possible.
- Tests and a concise change summary are expected.
- Security-sensitive failures should remain appropriately generic.
