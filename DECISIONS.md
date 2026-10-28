# Decision log — 28 October 2026

## Commercial gate
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
