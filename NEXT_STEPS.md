# Prioritized next steps

## P0 — commercial validation before expansion

1. Owner reviews the research and chooses whether to authorize interviews/outreach. Nothing is scheduled or sent automatically.
2. Qualify twenty companies using GO_TO_MARKET.md criteria. Obtain five observed workflows and appropriately anonymized export pairs.
3. Offer ten qualified buyers the bounded €249 diagnostic. Stop if none buys; continue only with evidence of paid value and usable data.
4. Measure preparation time, review effort, false positives and actionable outcomes against an observed manual baseline. Test paid repeat use in a second billing period.

## P0 — required before real operational use

- Independently review security, data handling, recovery and access revocation.
- Validate canonical-ID assumptions, minimum commitments and bundle policy on real records.
- Run a live model evaluation only with an authorized project key and permitted data; compare with the current conservative baseline on a new, independently labelled set.
- Test backup/restore and Docker on the intended deployment host. The supplied Docker/CI configs are not evidence of execution.

## P1 — only if paid pilots demand them

- Reusable per-supplier column/ID mapping with explicit user approval, because current canonical CSV preparation is the largest onboarding burden.
- Versioned cross-period alias memory, with revocation and edition/contract boundaries. Current mappings are run-scoped.
- More robust abstention for ambiguous service descriptions and held-out evaluation; fix the known Web Filtering versus DNS Filtering false proposal before any automated matching claims.
- Purpose-built period/credit/quantity aggregation for one validated billing model; don't generalize annual commitments by guessing.
- User/session revocation, password recovery, retention/deletion, backups and operational telemetry.

## P2 — gated by demonstrated recurring demand

- One read-only PSA connector chosen from paying customers' actual stack.
- Bookkeeper multi-workspace UI with tested tenant isolation and appropriate permissions.
- Hosted deployment architecture, managed identity and independently reviewed security.
- Billing-system writes only after domain validation, explicit approvals, idempotency and rollback design. Current product deliberately has none.

## Explicitly deferred

PDF/OCR ingestion, email agents, automated customer contact, payments, tax/FX calculations, comprehensive contract extraction, vector infrastructure and a large dashboard feature catalogue. These add complexity before the commercial hypothesis has passed its gate.
