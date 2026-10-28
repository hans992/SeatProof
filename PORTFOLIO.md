# Technical case study and career materials

> Historical record — superseded on 28 October 2026 by [COMMERCIAL_VERDICT.md](COMMERCIAL_VERDICT.md). Commercial development is stopped; no compelling advantage over the four compared products was established. Earlier pilot, pricing, outreach and feature proposals below are inactive hypotheses, not the current recommendation.

## Case study

**Problem:** MSP finance operators report recurring difficulty aligning vendor quantities with customer charges. The same category has mature competitors. This project deliberately separates evidence of a painful workflow from evidence that a new software business deserves to exist.

**Discovery:** Screened 32 workflows across many sectors, curated 50 dated/classified source records, examined seven competitors/substitutes groups and scored finalists with explicit penalties. CloudOlive's equivalent file-based workflow was retained as counterevidence. Outcome: an unvalidated pilot hypothesis, not a market-validation claim.

**Engineering decision:** Built a single local workflow with Node 24, SQLite and browser modules. Avoided a collection of fake dashboard features and external provisioning. The user can import actual CSV files, retain raw source provenance, review a proposed alias, recompute quantities, record a disposition and export a durable evidence packet.

**Reliability boundary:** Exact joins require canonical identifiers. The deterministic comparator refuses unsupported periods, currencies, metering and credits. Model output can propose a bounded ID with literal evidence but cannot alter billing. Human decisions are versioned and audited. Changed mappings invalidate earlier dispositions.

**AI design:** Candidate retrieval reduces context to at most five same-customer rows. The optional Responses integration uses JSON schema, explicit untrusted-data instructions, refusal/incomplete handling, output validation, timeout and usage telemetry. Offline mode is a labelled lexical baseline. This is retrieval-assisted structured matching, not embedding-based RAG or an autonomous agent system; no embeddings, vector database, tool-using agent, live inference or production deployment is claimed.

**Evaluation:** Initial synthetic diagnostic set: 21/24 correct decisions and three incorrect proposals. Adding obvious plan and service-conflict guards yields 23/24, with 12 correct proposals out of 13 and one remaining false suggestion. The same set informed those changes; it is not an independent held-out result. Live adapter tests mock network responses. Exact-name matching is more conservative but misses more aliases. No human time savings were measured.

**Verification:** 24 automated tests include full HTTP workflow, tenant/role isolation, CSRF, source validation, persistence, audit tampering, model failure paths and stale versions. Browser testing found a separate form-name collision, repaired and verified by saving/reloading a decision. This illustrates why API tests alone do not establish a working UI.

**Commercial learning:** AI quality may not be the binding constraint. Getting canonical exports, interpreting bundles and earning trust may dominate the buyer's costs. The next experiment is a paid diagnostic with observed time and repeat usage, not another connector or feature.

## AI engineering portfolio summary

SeatProof demonstrates bounded retrieval, structured-output provider integration, semantic guardrails, abstention, provenance, deterministic computation, human review, usage traces, evaluation against a conservative baseline, and hostile-input handling. It also demonstrates the discipline to report unresolved errors and absent live validation. It does **not** establish deployment-scale AI operations, real-customer effectiveness or a defended business moat.

## CV bullets — truthful project wording

- Designed and implemented a local MSP billing-review application with SQLite persistence, tenant-scoped authorization, optimistic concurrency, immutable source snapshots and auditable review decisions.
- Built an optional structured-output LLM matching adapter with bounded retrieval, source-quote validation, refusal handling and cost/latency telemetry; verified integration behavior using mocked provider responses.
- Created a 24-case synthetic matching evaluation and exact-name baseline, retained initial failures and documented a remaining false proposal; implemented 24 automated tests spanning arithmetic, input validation, authentication, isolation and end-to-end HTTP behavior.
- Conducted public-source discovery across 32 workflows and seven finalists, explicitly rejecting claims of commercial validation where incumbent overlap and absent willingness-to-pay evidence remained.

Do not rewrite these as customer revenue, saved hours, production scale, successful live AI, or employer achievements. This is an independent prototype project.

## LinkedIn announcement draft — not published

I built SeatProof, a local workbench for reviewing MSP supplier exports against recurring PSA charges.

The interesting part wasn't the dashboard. It was deciding when *not* to compare two numbers: different service periods, currencies, bundles and uncertain product identities can all create convincing but misleading “savings.”

The prototype preserves source evidence, proposes bounded matches, requires human approval and exports a review packet. It includes an optional structured-output LLM adapter; the demonstration is explicitly offline, and live inference has not been validated.

I also researched the business before building. Established products already solve much of this workflow. I screened 32 problems, compared seven opportunities, and kept the conclusion honest: this is a pilot hypothesis, not a validated SaaS business.

The synthetic evaluation still exposes a wrong suggestion. That's useful evidence about where human review matters—and where the next work should go.

Next step: observed workflows and paid validation, before adding more software.

[Add repository/demo link only after reviewing and explicitly authorizing publication.]
