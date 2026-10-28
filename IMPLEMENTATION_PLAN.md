# Implementation plan

1. Finish 32-problem evidence catalogue, seven-candidate competition analysis, penalized scorecard and top-three hostile reviews before implementation.
2. Build one workflow: authenticate → import two CSV exports → inspect immutable rows → propose/approve alias matches → reconcile comparable lines → review each exception → export evidence packet.
3. Implement optional real model adapter with bounded candidate retrieval, strict JSON validation, deterministic guardrails, timeout, refusal/error handling, input hash and usage telemetry. Default to a labelled offline adapter. No credentials are sought from unrelated configuration.
4. Persist users, tenant-scoped runs, sessions and hash-linked audit events in SQLite. Use password hashing, HttpOnly sessions, CSRF, role checks, limits, CSP, escaped rendering and version conflict protection.
5. Test CSV parsing, decimal arithmetic, unsafe comparisons, matching ambiguity, prompt injection, stale decisions, authorization and complete HTTP workflow. Run a reproducible synthetic evaluation and browser demo.
6. Package source, sample input/output, launch scripts, deployment design, business validation plan and portfolio materials. Create local commits. Do not call the result production-ready.
