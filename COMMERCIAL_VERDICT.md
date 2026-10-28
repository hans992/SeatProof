# SeatProof: final commercial assessment

Assessment date: 28 October 2026. Decision: **stop commercial development of the standalone MSP reconciliation product; preserve the implementation as an engineering and portfolio artifact.**

No verifiable customer problem was identified that the working SeatProof prototype solves adequately and CloudOlive, Gradient Reconcile, BillRecon and BillingReconcile collectively leave inadequately solved. This conclusion supersedes the earlier recommendation to pursue a paid diagnostic or recurring pilot. It does not claim that every competitor is flawless or that a future business in the category is impossible.

## Evidence standard

SeatProof was checked against source commit `0ee96f041e220ede7756361cc7a75b8548c03703`, documented verification results and known limitations. Competitor claims below come from public documentation reviewed on the assessment date. These are documented offerings, not independently tested performance guarantees. No customer-data trials of competing products, customer interviews, paid pilots, comparative productivity measurements or live SeatProof model evaluation were performed.

Absence from public documentation is not proof that a competitor lacks a feature. BillRecon is in private beta; advertised functionality is not demonstrated production maturity. CloudOlive's production website returned little extractable content; no current numeric price or feature claim is inferred from its staging site. Earlier forum complaints are not treated as proof of current defects.

## Direct comparisons

### CloudOlive: vendors without PSA integrations

Datto's official listing explicitly describes CloudOlive comparing vendors with PSA contracts and reconciling vendors without PSA integrations. A CloudOlive co-founder describes importing vendor reports or invoices in varying formats and comparing them with PSA billing. [Datto listing](https://www.datto.com/integrations/cloudolive/), [co-founder's explanation](https://www.hostednetwork.com.au/blog/why-your-msp-shouldnt-be-reselling-multi-vendor-reconciliation/).

SeatProof requires a prescribed twelve-column CSV schema, shared canonical customer IDs and compatible SKUs. Users must prepare that data before import. No measured onboarding advantage exists. CSV reconciliation is already served; another upload workflow is not a demonstrated reason to switch.

**Result: no established advantage over CloudOlive for this problem.**

### Gradient Reconcile: file imports and monthly review

Gradient documents selectable columns, account/service mapping, remembered import profiles, optional aggregation of repeated service lines, and approve/dismiss/detail actions. SeatProof has no native column mapping, cross-period mapping memory or split-line aggregation. [Gradient import profiles](https://support.meetgradient.com/create-import-profile).

Gradient also documents activity history and PSA audit trails. SeatProof's packet implements traceability differently; this does not establish that Gradient's review process is inadequate. [Reconciliation and history](https://support.meetgradient.com/billable-basics).

One narrow difference is documented: Gradient's CSV guide says zero-quantity rows are removed, while SeatProof retains them. This can matter when checking continued billing after quantity falls to zero. However, BillRecon documents zero-vendor-count overbilling and orphaned billing lines. The difference does not establish an unserved problem across the alternatives. [BillRecon drift types](https://billrecon.com/docs/reconciliation/drift-types).

**Result: no compelling market gap; SeatProof's preparation and recurring mapping burden are disadvantages.**

### BillRecon: evidence, confirmed mappings and optional write-back

BillRecon documents remembered client/product mappings, evidence behind suggestions, visible pending decisions and withholding totals for unconfirmed products. Its exception documentation describes source records, PSA lines, calculation details, spreadsheet exports, expected exceptions and activity history. Write-back is optional. [Mapping](https://billrecon.com/docs/using/book), [exceptions and evidence](https://billrecon.com/docs/using/ledger), [workflow](https://billrecon.com/docs/reconciliation/workflow).

These capabilities overlap SeatProof's review and trust claims. SeatProof packages raw CSV strings, hashes and reviewer decisions together, but no customer has demonstrated that this solves a problem BillRecon's evidence workflow cannot.

BillRecon advertises private-beta availability. Its homepage and connector documentation list different connector breadths; this assessment does not treat every advertised integration as independently verified. [Product and availability](https://billrecon.com/), [connectors](https://billrecon.com/docs/connectors).

**Result: no established customer outcome advantage; uncertainty about competitor maturity is not proof of SeatProof superiority.**

### BillingReconcile: human-controlled, evidence-backed review

BillingReconcile explicitly describes a read-oriented workflow. Reviewers decide whether a difference needs a PSA update, source cleanup, mapping correction or no action. Its product page describes source evidence and decision records; its pricing includes AI-assisted review guidance. [Official FAQ](https://billingreconcile.com/resources/support/faq), [product workflow](https://billingreconcile.com/), [included capabilities](https://billingreconcile.com/pricing).

Human approval, evidence visibility, avoiding automatic invoice changes and AI assistance therefore already form part of a competing offer. SeatProof's default suggestions use lexical matching; its live-model path is mock-tested, with no comparative accuracy or time-saving evidence.

**Result: no established advantage over BillingReconcile's stated core workflow.**

## Remaining differences do not establish a business

**Local offline operation:** SeatProof runs without a cloud service or PSA credentials. No observed buyer has rejected the alternatives because of a mandatory offline requirement and valued SeatProof enough to pay. Public documentation does not establish that every competitor lacks a suitable deployment option. Local operation also does not establish superior security: the application does not encrypt its database and lacks operational identity and recovery features.

**Portable evidence packet:** raw CSVs, file/row hashes, mappings, decisions and hash-linked audit events are exported together. This is concrete functionality, not proof of unique customer value. The chain has no external anchor or signature; an administrator can rewrite it. It is not tamper-proof and establishes neither source correctness nor contractual billing entitlement. See [SECURITY.md](SECURITY.md).

**Conservative calculations:** incompatible periods, annual billing, bundles, credits and uncertain comparisons are held for review. This prevents unsupported arithmetic but leaves the hard work with the reviewer. SeatProof does not resolve minimum commitments, proration or bundled billing.

**Price:** Gradient lists an entry tier of $299/month for 0–150 active-contract customers. BillRecon advertises free private beta followed by plans from $179/month. BillingReconcile lists $129/month for 125 coverage items. SeatProof's €149/month and €249 diagnostic were hypothetical. Coverage, currency, support and preparation differ; no apples-to-apples cost advantage is established. [Gradient pricing](https://www.meetgradient.com/pricing), [BillRecon pricing](https://billrecon.com/), [BillingReconcile pricing](https://billingreconcile.com/pricing).

**Analyst-assisted service:** a diagnostic is not automatically a defensible repositioning. Gradient offers managed reconciliation covering minimums, included quantities, aggregation, overages and customer-specific exceptions. No superior service outcome or distribution advantage is demonstrated for SeatProof. [Gradient managed reconciliation](https://www.meetgradient.com/mbr).

## Decision and preservation

1. **Stop** investment in SeatProof as a standalone commercial product. Do not add features to manufacture a differentiation story.
2. **Preserve** the working code, synthetic fixtures, tests, known failures, evaluation limits and original Git history. The project demonstrates both implementation and a candid decision to stop when evidence does not support the business.
3. **Do not claim a commercial pivot or repositioning.** Keeping the work as a portfolio or internal utility is a disposition of the project, not evidence of a new market.
4. Reconsider only after an observed customer workflow shows an incumbent failing, SeatProof succeeding on the same records, and willingness to pay for that difference. This is a condition for reopening the decision, not an outreach campaign or development roadmap.

The documentation update preserves the application implementation. Earlier scores, pricing hypotheses, sales drafts and the embedded research page remain historical and are superseded by this assessment. The user explicitly authorized preservation at [hans992/SeatProof](https://github.com/hans992/SeatProof).
