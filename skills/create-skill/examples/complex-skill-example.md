# Example: Complex Workflow Skill with Progressive Disclosure

This demonstrates a full skill using references/, examples/, and scripts/ — targeting the complex-domain word target in SKILL.md with supporting resources.

```
api-endpoint-builder/
├── SKILL.md
├── references/
│   ├── patterns.md          # REST patterns, error handling, pagination
│   └── security-checklist.md # OWASP validation for endpoints
├── examples/
│   └── crud-endpoint.ts     # Complete working CRUD example
└── scripts/
    └── validate-routes.sh   # Checks route conflicts and missing handlers
```

## SKILL.md Content (abbreviated — showing structure, not the full ~1,600 words)

```markdown
---
name: api-endpoint-builder
description: >
  Use when the user asks to "create an API endpoint", "add a route",
  "build a REST endpoint", or needs to implement request handlers,
  middleware, or API validation. Also when adding CRUD operations
  or implementing pagination, filtering, or error responses.
---

# API Endpoint Builder

## Overview

Build production-ready REST API endpoints following project conventions.
Handles routing, validation, error responses, and security considerations.

## When to Use

- User asks to create or modify API endpoints
- Adding CRUD operations to a resource
- Implementing pagination, filtering, or sorting
- "How do I add a new route?"
- "Create an endpoint for X"

## Do Not Use When

- Building GraphQL resolvers — different paradigm
- WebSocket or real-time endpoints — different transport
- Modifying authentication/authorization middleware — use auth-management skill
- Pure database schema work with no API surface

## Required Context

- Existing route structure (scan routes/ or controllers/ directory)
- Project's HTTP framework (Express, Fastify, Hono, etc.)
- Existing middleware chain
- Database models for the target resource

## Workflow

1. Read the existing route files in full to learn project conventions.

   Done when the framework, URL naming pattern, and middleware chain are identified.
2. Identify the resource, HTTP methods, and URL patterns needed.

   Done when every new route has a method and a path.
3. Run `scripts/validate-routes.sh` to check for route conflicts.

   Done when the script exits zero.
4. Implement the endpoint following patterns in `references/patterns.md`.

   Done when every route from step 2 has a handler.
5. Add input validation for all user-supplied parameters.

   Done when every path, query, and body parameter is validated at the boundary.
6. Implement error responses with appropriate HTTP status codes.

   Done when every failure path returns a 4xx or 5xx response without internal details.
7. Run the security checklist from `references/security-checklist.md`.

   Done when every checklist item passes or has a stated reason.
8. Write or update tests for the new endpoint.

   Done when the happy path and at least 2 error cases pass.
9. Send one manual test request to the running endpoint.

   Done when the response matches the expected status and body.

## Tool Guidance

**Prefer:**
- Read route files in full rather than searching them — conventions need full context
- Project's existing test runner for validation

**Avoid:**
- curl with real credentials in examples (use placeholders)
- Modifying shared middleware without confirming scope with user

**Constraints:**
- Never expose internal error details in API responses
- Always validate and sanitize user input at the boundary
- Follow existing project auth patterns — do not invent new ones

## Success Criteria

- Endpoint responds correctly to valid requests
- Invalid input returns appropriate 4xx with helpful message
- Unauthorized access returns 401/403
- Tests pass for happy path and at least 2 error cases
- No route conflicts with existing endpoints
- Security checklist passes

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing input validation | Validate all params, query, body at boundary |
| Leaking stack traces in responses | Use error handler middleware; return safe messages |
| Inconsistent URL patterns | Match existing resource naming conventions |
| Forgetting pagination defaults | Always set max page size; default to page 1 |

## Failure Modes

- **Unknown framework:** Stop and ask user which HTTP framework the project uses.
- **No existing route patterns:** Ask user for preferred conventions before inventing them.
- **Auth requirements unclear:** Escalate — do not guess authorization rules.

## Additional Resources

- **`references/patterns.md`** — REST patterns for CRUD, pagination, filtering, error responses. Load before implementing in step 4.
- **`references/security-checklist.md`** — OWASP-based endpoint security validation. Load at step 7.
- **`examples/crud-endpoint.ts`** — Complete working CRUD endpoint with validation and tests. Load when the project has no existing endpoint to imitate.
- **`scripts/validate-routes.sh`** — Detects route conflicts and missing handlers. Run at step 3; read it only when it fails.
```

## Why This Works

- **SKILL.md is ~1,600 words** — within complex skill target
- **Progressive disclosure** — Security checklist and REST patterns live in references/, not the body
- **Script for determinism** — Route validation is scripted, not improvised each time
- **Complete example** — One excellent CRUD example, not five mediocre ones
- **Clear boundaries** — Won't try to handle GraphQL, WebSocket, or auth middleware
- **Failure modes with escalation** — Agent knows when to stop and ask
- **Tool guidance** — Prevents common mistakes like exposing credentials in curl commands
- **Description** — Trigger-focused with quoted phrases, includes symptom keywords, no workflow summary
