# Demonstration script and usefulness benchmark

## Five-minute demonstration

1. Run `npm run demo`; open http://127.0.0.1:4317. Sign in with `demo@example.test` / `SeatProof-demo-2026`. All data is fictional and stored separately from private-workspace data.
2. Inspect Atlas Studio. Supplier row V001 has 28 seats; PSA P001 has 25 at €24. The €72 quantity exposure is directly reproducible. Explain that a contract minimum could make the difference intentional.
3. Inspect Birch: 40 supplier versus 45 billed devices at €4.50. The separate €22.50 overbilling signal must not be netted against underbilling or called a refund.
4. Select Cedar's unmatched supplier line. Click **Suggest with offline matcher**. The label explicitly says no AI inference. Read the source descriptions, then record an approval reason and approve P003. Two extra seats at €32 add €64; possible underbilling becomes €136.
5. Inspect Delta (annual/monthly), Finch (USD/EUR), West (bundle), Green (supplier only) and Old Mill (PSA only). All remain visible and unquantified. No assumptions about FX, missing prices or bundles are invented.
6. Record a follow-up or checked/excluded disposition with evidence. Reload to demonstrate persistence. Each mutation increments the version and audit history.
7. Export CSV and JSON. Draft status persists until every exception has a recorded disposition. A reviewed packet still may contain follow-up tasks. Nothing is sent to billing systems.
8. Open Run history for mode, latency, usage and input hashes. Open Research & evidence for the 32-problem screen and direct competitor counterevidence.

The saved browser demo may already contain QA decisions. `npm run demo:packet` always generates a fresh independent synthetic packet in memory without altering the UI database. For a fresh interactive run, import a deliberately new synthetic period with matching service dates in both files; do not delete an existing database casually.

## Manual baseline protocol — defined, not measured

Give an independent MSP billing operator the same two CSVs, a spreadsheet and these rules: pair only known identities; compare full matching periods/currencies/units; flag unmatched rows; don't assume recoverability. Ask them to produce a list of rows needing follow-up and cite original records. Record elapsed active minutes, joins changed, missed cases and false flags. Repeat with SeatProof on a counterbalanced different dataset to reduce learning effects. Obtain real anonymized export pairs before drawing conclusions about useful time saved.

Gold expectations on this fictional set: V001 +3/€72, V002 −5/€22.50, V003 +2/€64 after justified alias approval; V004 aligned; V005/V006/V008 held; V007 unmatched; P009 standalone. These are test expectations, not measurements of customer recoveries. P003 ceases being an orphan once mapped.

## What was measured

Automated local parsing plus comparison of 16 records over 100 repetitions; see artifacts/evaluation.json for median/p95. This excludes human mapping/review, network, model inference, PDF extraction and real onboarding. Comparing milliseconds to invented human minutes would be misleading.

## Output

`artifacts/demo-evidence-packet.json` contains original inputs, mappings, reviewer notes, traces and audit hashes. `artifacts/demo-findings.csv` is a flattened review list. The packet has €136 underbilling and €22.50 overbilling indicators; neither is booked or recovered revenue.
