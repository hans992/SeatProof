# Decision log — 28 October 2026

## Final decision — stop commercial development

The direct CloudOlive, Gradient Reconcile, BillRecon and BillingReconcile comparison established no compelling customer advantage. Preserve the working code and original history for engineering and portfolio use. No evidence-backed commercial pivot or service-led repositioning was identified. [COMMERCIAL_VERDICT.md](COMMERCIAL_VERDICT.md) supersedes the pilot recommendation below. The user subsequently authorized publication to hans992/SeatProof with this negative conclusion; application code is unchanged.

## Original commercial gate — historical
No candidate has convincing evidence of willingness to pay for a *new differentiated product*. Public practitioner reports demonstrate problems, and paid incumbents demonstrate category spending; neither validates this business. No interviews, signed pilots, or revenue exist.

Proceed with **SeatProof**, a clearly labelled portfolio and paid-pilot hypothesis: a local-first, export-based pre-bill reconciliation workbench for small managed IT service providers (MSPs). The end-to-end job is importing supplier and PSA CSVs, resolving product aliases with evidence, checking comparable quantities, reviewing exceptions, and exporting an audit packet.

CloudOlive already supports vendor files and comparison; Gradient supports CSV uploads alongside integrations. Export ingestion, AI matching, and discrepancy dashboards are **not unique**. The testable wedge is a small, locally operated audit tool with explicit uncertainty and no required PSA connection, sold first as a paid diagnostic to owner-operated MSPs or their bookkeepers. This is packaging and acquisition positioning, not a moat. Reject a general billing-reconciliation SaaS launch until demand tests pass.

## Build boundaries
- Local software only; no publication, hosted account, purchase, production deployment, or prospect contact.
- Only synthetic data. No unrelated files, repositories, accounts, or credentials inspected.
- No autonomous invoice changes. Reviewer decisions and exports are local; nothing is sent to a PSA or customer.
- CSV inputs explicitly identify service period, currency, unit, and recurring billing basis. Credits, proration, bundles, and uncertain joins must be held for review rather than turned into fictional recovered revenue.
- Deterministic arithmetic and validation; optional OpenAI structured-output suggestions for semantic matching. Offline mode is visibly labelled a lexical adapter, not AI inference.
- Native Node 24 HTTP + SQLite + vanilla browser modules. Avoid dependencies for this bounded local deployment; explicit security tests compensate for the small custom server surface. A SaaS version needs managed identity, TLS, backups, operational review and independent security testing.

## Research method adjustments
Broad multi-query search results were heavily concentrated on a subset of queries. Follow-up single-topic searches broadened coverage. Promotional posts, cross-posts, and vendor case studies are labelled rather than counted as independent buyer validation. Current vendor pages take priority over dated pricing aggregators. CloudOlive's production pricing page returned no extractable text; its staging page is not treated as a verified current quote.

The Canvas skill describes a Cursor-specific managed path with no workspace mapping for this Codex project. The requested Markdown reports and an interactive local research page are the portable deliverables; no unrelated Cursor project is modified. The Sites local-only workflow applies. Stripe Directory is unavailable (CLI absent, documentation endpoint unreadable via web); no external provider is provisioned or purchased.

## Verification decisions

Initial lexical evaluation made three false proposals. Added explicit plan/service conflicts, retained the initial report and disclosed reuse of the diagnostic set. One false proposal remains; human approval remains mandatory. No unsupported accuracy or savings claim is used in the business case.

Browser testing revealed that form named-property access was unsafe for a field called `id`; dispatch now reads the HTML attribute. Save/reload behavior was verified in the browser after the fix. Canonical customer IDs and SKUs use strict identity, with tuple serialization to avoid delimiter collisions. Quantity/price bounds keep aggregate integer-cent totals inside safe integer limits.
