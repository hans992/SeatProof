# Verification results — 28 October 2026

## GitHub preservation verification

After the user authorized repository publication, [GitHub Actions run 40741774183](https://github.com/hans992/SeatProof/actions/runs/40741774183) completed successfully for commit `571f44e259214bf551d2ae96ded1e623eb7610cf` on Ubuntu with Node 24. The `npm test`, `npm run evaluate` and `npm run demo:packet` steps all passed. Application code, tests, fixtures, artifacts and build configuration match the original preserved implementation at `0ee96f0`; publication changes were documentation-only. This supersedes the original report's unverified Linux/GitHub Actions status below. Docker execution, real customer outcomes and live model evaluation remain unverified.

## Automated checks

Command: `npm test` using Node v24.18.0 on Windows. **24 tests passed; 0 failed** in the final recorded run (866.4954 ms runner duration). This is a suite timing, not product latency or human productivity.

Coverage includes:

- CSV quoting/BOM/embedded line breaks, malformed input, duplicate IDs, exact headers, real dates, bounded numeric parsing and integer-cent arithmetic.
- Duplicate service keys, strictly opaque customer IDs, delimiter-collision prevention, same-customer mapping, source preservation and one-to-one constraints.
- Currency, period, annual basis, unit, proration, credit and zero-price holds; margin versus revenue distinction; orphan retention; stale decision invalidation.
- Spreadsheet-formula neutralization and instruction-like input quarantine.
- Bounded candidate retrieval, ambiguity abstention, edition conflicts, invented model IDs/quotes, extra fields, refusals, incomplete outputs, invalid JSON, HTTP failure and missing key.
- Offline mode does not call the network. Mocked live call verifies the Responses endpoint, structured schema, `store:false`, minimized fields and usage/cost calculations. No live provider call was performed.
- HTTP integration from account creation through import, matching, human approval, every exception disposition, draft/reviewed exports and database reopen.
- Cross-tenant read/export/mutation rejection, viewer read-only access, owner-only account creation, CSRF, Origin and content-type rejection, duplicate imports, optimistic version conflicts, session invalidation and audit tamper detection.

## Failures found and repaired

1. Sandbox initially blocked loopback connections, so HTTP tests could not run. They were rerun with approved local-loopback execution. This was an environment failure, not a passing test.
2. Account creation had seven SQL placeholders for six user fields. Fixed and rerun; the full HTTP suite passed.
3. Browser testing found that a hidden field named `id` shadowed the form's `id` property, preventing the review-submit branch from executing. Changed dispatch to `getAttribute('id')`. Browser save, visible review status and reload persistence were then verified. API tests alone did not catch this.
4. Initial offline evaluation exposed unsafe Plan 1/Plan 2 and backup/monitoring proposals. Added explicit conflicts. The initial report is retained in `artifacts/evaluation-initial.json`.
5. Responsive inspection revealed cramped inline metric labels; changed mobile metrics to stacked labels/values. Mobile content width equals viewport content width (375 CSS px in the tested 390 px browser override, accounting for scrollbar).

## Synthetic matching evaluation

Dataset: `evals/aliases.json`, **24 author-labelled synthetic cases**, 12 positive identity mappings and 12 cases requiring abstention. It contains exact names, suffixes, abbreviations, edition/suite conflicts, ambiguity, duplicate descriptions, instruction-like text and unproven equivalences. It is not customer data or an independent benchmark.

Initial offline results: 21/24 decisions correct; proposal precision 12/15 (80%); positive recall 12/12; three false proposals: A21, A22, A24.

After the documented guard fixes: **23/24 decisions correct; proposal precision 12/13 (92.3%); positive recall 12/12; abstention accuracy 11/12; coverage 13/24**. Remaining false proposal A24: “Web Filtering” versus “DNS Filtering.” Those descriptions do not establish service equivalence. The same diagnostic set informed the fixes, so improvement is not held-out validation. A fresh independently labelled real-data set is required.

Exact normalized-name baseline: 17/24 correct decisions; 5/5 proposal precision; positive recall 5/12; 12/12 correct abstentions. This baseline sacrifices coverage for caution. Neither result establishes willingness to pay or safe automatic billing.

`artifacts/evaluation.json` records individual results. Automated local parsing/reconciliation of the 16-row synthetic example over 100 iterations measured **median 0.3233 ms and p95 0.6642 ms** in the recorded evaluation. Hardware/load dependent; excludes human review, file normalization, network and live inference. No customer time savings measured.

## Browser verification

Verified in the Codex in-app browser against the loopback demo:

- Sign-in and rendered review queue.
- Initial €72/€22.50 synthetic indicators.
- Cedar candidate suggestion, explicit human approval and updated €136/€22.50 indicators.
- Review note submission, visible saved disposition and persistence after reload.
- Actual supplier/PSA file uploads; identical files reopen the saved run rather than creating duplicates.
- JSON packet download through the UI; download completion observed and export confirmation visible.
- Desktop evidence layout and responsive phone-width layout; screenshots in `artifacts/workbench.png` and `artifacts/mobile.png`.
- Browser console inspection returned no captured errors/warnings at the final checked point. This is not exhaustive console monitoring or an accessibility audit.

## Sample packet verification

`npm run demo:packet` creates an independent in-memory run and records all eight exception dispositions. Output: €136 potential underbilling, €22.50 potential overbilling, three held comparisons, one supplier-only and one PSA-only line; all 16 source records retained. JSON status is REVIEWED because every exception has a disposition, not because follow-up work is resolved. Audit-chain verification is covered by tests. Source files and output are synthetic.

## Unverified / not claimed

Live model quality, latency, cost or credential availability; real exports and customer usefulness; human baseline timing; Docker build/run; Linux/GitHub Actions execution; hosted deployment; concurrency/load behavior at scale; complete accessibility compliance; independent penetration test; backup restore; MFA/recovery/revocation; any regulatory compliance or production readiness.
