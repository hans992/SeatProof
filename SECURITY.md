# Security boundary and review

This document records implemented controls and known gaps. It is not an independent security audit or a compliance certification.

## Implemented controls

- Parameterized SQL, server-derived organization scoping on all run/list/export paths, role checks on mutations and owner-only account creation.
- Salted scrypt password hashes; random 256-bit session tokens stored hashed; HttpOnly, SameSite=Strict cookies; Secure when configured origin is HTTPS. Eight-hour sessions, explicit logout and no browser token storage.
- Exact Host and Origin checks, JSON-only mutating APIs, per-session CSRF tokens, request/file/row limits, login/import/suggestion rate limits, and one in-flight suggestion per run.
- CSP restricted to same origin, no frames or base URL overrides, escaped untrusted UI text, no rendered model HTML, formula-leading CSV export cells neutralized.
- Immutable input snapshots, SHA-256 file and canonical-row hashes, optimistic versions and transactional hash-linked audit events. Versions prevent stale review writes.
- Strict JSON schema plus application checks on model output: only retrieved row IDs, literal evidence substrings, no invented fields, edition/suite conflicts rejected. Fixed OpenAI endpoint; no model tools, filesystem access or arbitrary URLs. Prompt text treats source content as untrusted. Instruction-like strings are quarantined.
- Failed, incomplete, refused and malformed model outputs cannot change a mapping. Suggestions always require a separate human action. Amounts come from deterministic arithmetic, never model output.

## Verified attacks/failure cases

Tests cover cross-tenant read/export/mutation, viewer mutation, hostile Origin, missing CSRF, malformed/duplicate CSV, opaque-ID collisions, unsafe numeric bounds, instruction-like text, fabricated model IDs/quotes, refusals and failed provider calls. A modified audit event fails verification. See TEST_RESULTS.md for limits.

## Remaining risks

- Local database and backups are not encrypted by the app. Disk access can expose source files, reviewer notes and user email addresses. Relying on OS permissions is insufficient for a hosted service.
- Hash chains detect edits relative to an existing chain; a database administrator can rewrite an entire chain. There is no external anchor or cryptographic signature. Do not call it tamper-proof.
- No MFA, SSO, password reset, account suspension/revocation UI, session-management UI or password rotation workflow. Known demo credentials are only for synthetic loopback use.
- Rate limits are process-local and reset on restart; synchronous password hashing is not designed for internet-scale abuse. The server is not hardened against all denial-of-service patterns.
- Prompt-injection pattern screening is incomplete. Safety primarily comes from no tools, bounded data, server validation and mandatory human review. Literal quotes prove provenance, not product equivalence. One synthetic lexical false positive remains.
- Exact joins assume imported canonical identifiers truly represent the same customer and SKU. Incorrect source normalization can produce a wrong join. Product/contract minimums still require review.
- Raw exports contain business-sensitive data. JSON packets include both original CSVs and workspace audit events; recipients must be authorized. Browser download handling and storage are outside application control.
- `store:false` requests provider nonstorage behavior; it is not a claim of zero retention, EU residency, regulatory compliance or a data-processing agreement. Authorized provider access and data terms must be checked before live use.
- No independent pentest, dependency supply-chain attestation, container scan, disaster-recovery exercise or live model security evaluation was performed.

Before sharing real customer data or hosting remotely, address these gaps and commission an independent review. The current deliverable is suitable for local synthetic demonstrations and controlled validation planning.
