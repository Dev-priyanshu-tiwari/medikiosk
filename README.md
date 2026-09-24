# MediKiosk

**Your story reaches the doctor before you do.**

An AI-powered **pre-consultation clinical intake** prototype for high-volume Indian hospitals — voice + touch kiosk for patients, and a physician dashboard that receives a verified pre-consultation summary.

> ⚠️ **Prototype notice** — 100% mock data and simulated AI. MediKiosk never diagnoses, never prescribes, and never recommends treatment. Every AI item is editable / verifiable / rejectable by the doctor, who remains the final decision-maker.

---

## Run

```bash
cd medikiosk
npm install
npm run dev
```

Open **http://localhost:5199**

## Two experiences

| Route | Experience |
|---|---|
| `/` | **Patient Kiosk** — guided 8-step flow: Welcome → Identify → Consent → AI History → Red Flag → Documents → Timeline → Summary |
| `/doctor` | **Doctor Dashboard** — clinical summary with per-field source tags and Edit/Verify/Reject, timeline, documents, AI transparency panel, doctor actions |

## Demo mode

Use **"Demo Patient"** on the Welcome screen (or `?demo=1`) to auto-load Rajesh Kumar (57 M, Cardiology, Hindi) and run the full scripted journey:

- Chest pain × 3 days → exertional worsening → breathlessness → **red-flag triage**
- Hypertension + Diabetes (discharge summary 2024)
- Amlodipine 5 mg + Metformin 500 mg (prescription 2025)
- HbA1c 8.1% + Hemoglobin 10.2 g/dL (lab report 2026)

## Simulated AI service layer

`src/services/mockAI.ts` implements: `startSession`, `detectLanguage`, `processSpeech`, `generateFollowUpQuestion`, `detectRedFlags`, `processMedicalDocument`, `extractClinicalEntities`, `buildMedicalTimeline`, `generateClinicalSummary`, `submitToDoctor` — all returning structured JSON internally (patient record, sources, confidence scores) that is never exposed raw to patients.

## Safety guardrails baked in

- No diagnosis / prescription / treatment recommendation — ever.
- Missing information renders as **"Not Reported"**.
- Low-confidence OCR renders as **"Needs physician verification"**.
- Red flags trigger **human triage** — status becomes "Priority Triage".
- Doctor is the final decision-maker ("AI prepares the information. The doctor makes the decision.").
