# Business case: SeatProof

> Historical record — superseded on 28 October 2026 by [COMMERCIAL_VERDICT.md](COMMERCIAL_VERDICT.md). Commercial development is stopped; no compelling advantage over the four compared products was established. Earlier pilot, pricing, outreach and feature proposals below are inactive hypotheses, not the current recommendation.

## Status

An unvalidated product hypothesis with a working local prototype. No customers, interviews, paid pilots, revenue or measured human productivity gains. The research establishes a real category with powerful incumbents. It does not establish a commercially defensible entrant.

## Proposed customer and purchase trigger

Owner or finance/bookkeeping operator at an MSP managing roughly 200–2,000 seats across multiple suppliers, using recurring PSA lines and periodically exporting usage/invoices. Trigger: a missed charge, recent vendor change, failed integration, or pre-bill check. Initial geography: English-speaking EU/UK MSPs; German language and local tax workflows are not implemented. Exclude firms already happy with CloudOlive/Gradient/Halo, firms unable to export comparable records, and customers needing automated billing write-back.

## Differentiation thesis to test

Some small MSPs may pay for a locally operated, explicit, evidence-backed audit before committing to another integration project. It must fit a monthly routine with minimal mapping work. Export ingestion, discrepancy detection, human approval and AI are not unique. There is no demonstrated moat. A service-led diagnostic plus lightweight tool is more credible initially than claiming a new SaaS category.

## Hostile evaluation of the three finalists

### MSP export audit — 48.5/100 after penalties

- **Refuse to buy:** another monthly upload chore; ambiguous bundles require the same expert anyway; security review for billing records; CSV mappings could cost more than saved effort.
- **Keep current solution:** Halo/Gradient/CloudOlive already know contracts and can update PSA invoices. Positive incumbent testimonials are explicit counterevidence (S02, S06).
- **Copy risk:** local audit reports and uncertainty labels are simple additions for incumbents.
- **Fatal assumption:** a useful comparison can be obtained from two exports without extensive contract interpretation or API access.
- **€1,000 MRR:** seven retained accounts at €149/month = €1,043 gross MRR, excluding VAT, fees, churn and services. Requires an identified buyer, acceptable false-positive rate and repeat use. This is arithmetic, not a forecast.
- **Cheapest disproof:** recruit five qualified firms only after outreach is authorized; inspect anonymized exports and offer a €249 paid diagnostic. Stop if none pays after ten qualified offers, fewer than three can produce usable exports, or review work exceeds manual process after setup. Conduct interviews before offering software.

### PO confirmation checking — 32.5/100

- **Refuse:** SAP/EDI already works, and errors are rare; confidentiality of supplier pricing; false joins are worse than manual checks.
- **Keep current:** buyer already uses ERP to resolve delivery splits and part aliases; another queue adds work.
- **Copy:** existing document-automation vendors already handle acknowledgements.
- **Fatal assumption:** sufficiently many non-EDI confirmations can be processed without supplier-specific setup.
- **€1,000 MRR:** four buyers at hypothetical €250/month, with enough volume and low mapping support; no price validation.
- **Disproof:** compare 50 anonymized real PO/confirmation pairs from three buyers with current process; request one paid pilot before building ERP connectors. Stop if setup overwhelms review or exceptions are already handled automatically.

### Freight invoice evidence — 30/100

- **Refuse:** incumbent audit service takes a share of recoveries; our subscription asks for money before recovery.
- **Keep current:** carrier negotiation expertise, rate engines and shipment context are embedded in existing teams.
- **Copy:** audit providers already digitize contracts and collect evidence.
- **Fatal assumption:** source documents contain enough information to judge a charge without broker expertise or hidden tariff terms.
- **€1,000 MRR:** five shippers at hypothetical €200/month; also requires sufficient disputable volume and a process to actually recover funds.
- **Disproof:** independently label 30 invoices with a logistics operator; compare packet completeness and successful resolution with existing process. Stop if information is missing or contingency services dominate willingness to pay.

## Proposed pricing and economics — assumptions, not offers

- Diagnostic: €249 one-time, one billing period, two exports, no write-back, with analyst review. If onboarding takes four hours at €50/hour, only €49 remains before overhead/taxes; this is not attractive without learning value.
- Recurring pilot: €149/month per MSP, up to 1,000 rows per side per run, local deployment, bounded support. Seven accounts reach €1,043 MRR. A lower €99 price needs eleven accounts (€1,089). No payment system is implemented.
- Founder-hosted version assumption: €20–40/month shared infrastructure, plus backups/logging, payment fees, tax and security obligations. No service purchased; availability/cost not quoted from a provider.
- Support assumption: 30 minutes/account/month at €50/hour = €25; acquisition/onboarding are additional. Two hours instead costs €100 and nearly eliminates margin at €149.
- Model reference: GPT-4.1 mini displayed $0.40/$1.60 per million input/output tokens on 28 October 2026 ([official model reference](https://developers.openai.com/api/docs/models/gpt-4.1-mini)). An illustrative 2,000-input/300-output suggestion costs $0.00128; 1,000 such calls cost $1.28, excluding retries, taxes and FX. Actual token usage is recorded only for live calls. No live calls measured here. Runtime adapter bounds each suggestion to five candidates and 400 output tokens; arbitrary price/model overrides disable the default estimate.
- Local offline inference/API cost: zero external API charges, not zero electricity, hardware or support cost. Never combine a hypothetical USD API cost with EUR revenue without a stated conversion assumption; none is applied here.

## Validation gates

1. Five observed workflows with recent examples, five usable anonymized export pairs and explicit consent/data terms.
2. At least two paid diagnostics among ten qualified offers; otherwise reconsider the niche or offer.
3. Three firms voluntarily repeat for a second billing period; otherwise recurring use not established.
4. Zero silently dropped rows; zero automatic writes. Quantified exceptions must have comparable identifiers, units, currency and periods.
5. Target ≤15 minutes monthly review after onboarding and ≥50% less time than observed manual baseline are *future targets*, not achieved savings. Record both actual times and false positives.

The next investment should be paid workflow validation, not additional features.
