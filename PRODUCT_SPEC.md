# Product specification

## User job

A small MSP's billing owner needs to identify mismatches between supplier quantities and recurring customer charges before releasing invoices. Today the operator exports records, aligns customer/product names in a spreadsheet, checks periods and units, and records follow-up questions. This workflow is inferred from public accounts; it has not been directly observed in an interview.

SeatProof replaces the ad hoc comparison worksheet with a local review record. It does not replace the PSA, accounting system, contract or billing decision-maker.

## Vertical workflow

1. Owner creates workspace and local analyst/viewer accounts.
2. Analyst uploads two explicitly normalized CSV exports; invalid inputs are rejected before a run is saved.
3. Unique exact canonical customer/SKU pairs are linked. Duplicate keys remain unresolved. Input files and row hashes persist.
4. Unmatched supplier rows retrieve up to five same-customer PSA candidates by lexical similarity. Offline or live model mode is clearly identified.
5. Analyst inspects original fields and quotes, supplies a reason and approves a one-to-one mapping. Cross-customer mappings are prohibited. Remapping clears prior decisions to prevent stale approvals.
6. Comparator checks basis, dates, units, currencies, credits and proration. Only comparable quantity deltas receive indicative amounts, using the PSA selling price in integer cents.
7. Analyst gives every exception a disposition and note: follow up, expected/checked, or excluded. No automated external action occurs.
8. Export CSV or full JSON evidence packet; draft/reviewed status reflects whether all exceptions have a recorded disposition. Reviewed does not mean recovered, resolved, or approved for billing.

## Acceptance results

- Each of the 16 synthetic source rows appears as a side of at least one finding; unmatched and orphan rows remain visible.
- Before alias approval: €72 possible underbilling, €22.50 possible overbilling, 10 findings, nine unreviewed exceptions.
- After V003→P003 approval: €136 possible underbilling, €22.50 possible overbilling, nine findings, eight exceptions. Five lines remain held/unmatched/orphan and unquantified.
- Duplicate import reopens the existing immutable-source run. Decisions persist across reload and database reopen.
- Foreign tenant run IDs return 404. Viewers can inspect/export but cannot import, map or review. Missing CSRF and hostile origins fail.

## Deliberate limitations

One-to-one, whole-unit recurring comparisons only. No automatic source-column mapping, customer-ID aliasing, line aggregation, contract interpretation, invoice editing, currency conversion, PDF parsing, OCR or mailbox ingestion. The word “AI” denotes only an optional suggestion provider, never deterministic arithmetic. A specialist may still need to interpret most real exports; paid pilots must measure that burden.

## Success criteria for a real pilot

Independent reviewer labels 50–100 real lines; measure false proposals, unresolved fraction, reviewer correction time, onboarding minutes and repeat monthly use. Never autoapprove a suggestion. A target of at least 95% proposal precision is proposed for future evaluation; the current synthetic 92.3% precision does not meet that target and is not a release gate for automatic billing, which is absent.
