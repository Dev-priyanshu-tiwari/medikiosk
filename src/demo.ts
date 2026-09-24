import type { ClinicalField, PatientIdentity, TimelineEvent, UploadedDoc } from './types';

/* ------------------------------------------------------------------ */
/* Demo patient                                                        */
/* ------------------------------------------------------------------ */
export const DEMO_PATIENT: PatientIdentity = {
  name: 'Rajesh Kumar',
  age: 57,
  gender: 'Male',
  department: 'Cardiology',
  abhaId: '12-3456-7890-1234',
  abhaVerified: true,
  mode: 'allopathy',
};

/* ------------------------------------------------------------------ */
/* Kiosk conversation (static, mock)                                   */
/* ------------------------------------------------------------------ */
export interface ChatTurn {
  role: 'ai' | 'patient';
  text: string;
  textHi?: string;
}

export const DEMO_CONVO: ChatTurn[] = [
  { role: 'ai', text: 'What brings you to the hospital today?', textHi: 'आज आप अस्पताल क्यों आए हैं?' },
  {
    role: 'patient',
    text: 'I have chest pain for three days.',
    textHi: 'मुझे तीन दिन से सीने में दर्द हो रहा है।',
  },
  { role: 'ai', text: 'When did the pain start?', textHi: 'दर्द कब शुरू हुआ?' },
  { role: 'patient', text: 'Three days ago, early morning.', textHi: 'तीन दिन पहले, सुबह जल्दी।' },
  { role: 'ai', text: 'Where exactly is the pain?', textHi: 'दर्द ठीक कहाँ है?' },
  {
    role: 'patient',
    text: 'Center of the chest. It spreads to my left arm.',
    textHi: 'सीने के बीच में। बाएँ हाथ तक फैलता है।',
  },
  {
    role: 'ai',
    text: 'Does it increase when walking or climbing stairs?',
    textHi: 'क्या यह चलने या सीढ़ियाँ चढ़ने पर बढ़ता है?',
  },
  { role: 'patient', text: 'Yes, worse when I walk.', textHi: 'हाँ, चलने पर बढ़ जाता है।' },
  { role: 'ai', text: 'Do you have difficulty breathing?', textHi: 'क्या आपको साँस लेने में दिक्कत होती है?' },
  { role: 'patient', text: 'A little, yes.', textHi: 'हाँ, थोड़ी होती है।' },
  {
    role: 'ai',
    text: 'Does the pain move to your arm, shoulder, back or jaw?',
    textHi: 'क्या दर्द हाथ, कंधे, पीठ या जबड़े तक जाता है?',
  },
  {
    role: 'patient',
    text: 'To my left arm and shoulder sometimes.',
    textHi: 'कभी-कभी बाएँ हाथ और कंधे तक।',
  },
  {
    role: 'ai',
    text: 'Thank you. Your answers are ready for the doctor.',
    textHi: 'धन्यवाद। आपके उत्तर डॉक्टर के लिए तैयार हैं।',
  },
];

/* Tap-answer chips shown under the live transcript */
export const QUICK_ANSWERS = [
  'Chest pain',
  'Fever for 3 days',
  'Stomach pain',
  'Breathing difficulty',
  'Body weakness',
];

/* Follow-up suggestions mapped from the chief complaint answer */
export const FOLLOW_UPS: Record<string, string[]> = {
  chest: [
    'When did the pain start?',
    'Where exactly is the pain?',
    'Does it increase when walking or climbing stairs?',
    'Do you have difficulty breathing?',
    'Does the pain move to your arm, shoulder, back or jaw?',
  ],
  fever: [
    'How long have you had fever?',
    'Have you measured your temperature?',
    'Do you get chills or sweating?',
    'Any cough or cold?',
    'Any medicines taken so far?',
  ],
  stomach: [
    'When did the pain start?',
    'Where exactly is the pain?',
    'How severe is it (1–10)?',
    'Is it related to food?',
    'Any vomiting or loose motions?',
  ],
};

/* ------------------------------------------------------------------ */
/* Documents (mock uploads)                                            */
/* ------------------------------------------------------------------ */
export const DEMO_DOCS: UploadedDoc[] = [
  {
    id: 'doc-1',
    fileName: 'Prescription_2025.jpg',
    kind: 'Prescription',
    sizeLabel: '1.2 MB',
    status: 'done',
    extractionProgress: 100,
    extracted: {
      medications: [
        { name: 'Amlodipine', dose: '5 mg', sourceDocId: 'doc-1', confidence: 0.97 },
        { name: 'Metformin', dose: '500 mg', sourceDocId: 'doc-1', confidence: 0.95 },
      ],
      rawLines: ['Dr. S. Verma, DM Cardiology', 'Rx: Amlodipine 5 mg OD', 'Rx: Metformin 500 mg BD'],
    },
  },
  {
    id: 'doc-2',
    fileName: 'Blood_Report_2026.pdf',
    kind: 'Lab Report',
    sizeLabel: '2.4 MB',
    status: 'done',
    extractionProgress: 100,
    extracted: {
      investigations: [
        { name: 'HbA1c', value: '8.1%', sourceDocId: 'doc-2', confidence: 0.92 },
        { name: 'Hemoglobin', value: '10.2 g/dL', sourceDocId: 'doc-2', confidence: 0.55, needsVerification: true },
      ],
      rawLines: ['HbA1c : 8.1 %', 'Hemoglobin : 10.2 g/dL'],
    },
  },
  {
    id: 'doc-3',
    fileName: 'Discharge_Summary_2024.jpg',
    kind: 'Discharge Summary',
    sizeLabel: '3.1 MB',
    status: 'done',
    extractionProgress: 100,
    extracted: {
      conditions: [
        { name: 'Hypertension', confidence: 0.94 },
        { name: 'Diabetes', confidence: 0.9 },
      ],
      rawLines: ['Admission: 3 days', 'Condition: Hypertension, Diabetes'],
    },
  },
];

/* ------------------------------------------------------------------ */
/* Medical timeline (shared by kiosk + doctor dashboard)               */
/* ------------------------------------------------------------------ */
export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-1',
    year: '2024',
    dateLabel: 'Aug 2024',
    type: 'Hospital admission',
    docLabel: 'Discharge Summary',
    docId: 'doc-3',
    title: 'Hospital admission',
    details: ['Condition: Hypertension', 'Diabetes noted at discharge'],
    source: 'Document',
    accent: 'blue',
  },
  {
    id: 'tl-2',
    year: '2025',
    dateLabel: 'Mar 2025',
    type: 'Prescription',
    docLabel: 'Prescription',
    docId: 'doc-1',
    title: 'Prescription',
    details: ['Amlodipine 5 mg', 'Metformin 500 mg'],
    source: 'Document',
    accent: 'teal',
  },
  {
    id: 'tl-3',
    year: '2026',
    dateLabel: 'Jan 2026',
    type: 'Lab report',
    docLabel: 'Lab Report',
    docId: 'doc-2',
    title: 'Lab report',
    details: ['HbA1c: 8.1%', 'Hemoglobin: 10.2 g/dL'],
    source: 'Document',
    accent: 'amber',
  },
  {
    id: 'tri-4',
    year: '2026',
    dateLabel: 'Today',
    type: 'Current visit',
    docLabel: 'Kiosk session',
    title: 'Current visit',
    details: ['Chest pain for 3 days', 'Breathlessness reported'],
    source: 'Patient',
    accent: 'rose',
  },
];

/* ------------------------------------------------------------------ */
/* Doctor dashboard clinical fields (mock)                             */
/* ------------------------------------------------------------------ */
export const DOCTOR_FIELDS: ClinicalField[] = [
  {
    id: 'df-chief',
    label: 'Chief Complaint',
    value: 'Chest pain × 3 days',
    source: 'Patient',
    confidence: 1,
    verification: 'unverified',
  },
  {
    id: 'df-hpi-1',
    label: 'History of Present Illness',
    value: 'Started 3 days ago',
    source: 'Patient',
    confidence: 1,
    verification: 'unverified',
  },
  {
    id: 'df-hpi-2',
    label: 'History of Present Illness',
    value: 'Worse during walking',
    source: 'Patient',
    confidence: 1,
    verification: 'unverified',
  },
  {
    id: 'df-hpi-3',
    label: 'History of Present Illness',
    value: 'Breathlessness reported',
    source: 'Patient',
    confidence: 1,
    verification: 'unverified',
  },
  {
    id: 'df-hpi-4',
    label: 'History of Present Illness',
    value: 'Further physician assessment required',
    source: 'AI Flag',
    confidence: 0.8,
    verification: 'unverified',
  },
  {
    id: 'df-past-1',
    label: 'Past Medical History',
    value: 'Hypertension',
    source: 'Document',
    confidence: 0.94,
    verification: 'unverified',
  },
  {
    id: 'df-past-2',
    label: 'Past Medical History',
    value: 'Diabetes',
    source: 'Document',
    confidence: 0.9,
    verification: 'unverified',
  },
  {
    id: 'df-med-1',
    label: 'Medications',
    value: 'Amlodipine 5 mg',
    source: 'Document',
    confidence: 0.97,
    verification: 'unverified',
  },
  {
    id: 'df-med-2',
    label: 'Medications',
    value: 'Metformin 500 mg',
    source: 'Document',
    confidence: 0.95,
    verification: 'unverified',
  },
  {
    id: 'df-allergy',
    label: 'Allergies',
    value: 'Not Reported',
    source: 'Patient',
    confidence: 1,
    verification: 'unverified',
  },
  {
    id: 'df-family',
    label: 'Family History',
    value: 'Not Reported',
    source: 'Patient',
    confidence: 1,
    verification: 'unverified',
  },
  {
    id: 'df-personal',
    label: 'Personal History',
    value: 'Not Reported',
    source: 'Patient',
    confidence: 1,
    verification: 'unverified',
  },
  {
    id: 'df-inv-1',
    label: 'Prior Investigations',
    value: 'HbA1c 8.1%',
    source: 'Document',
    confidence: 0.92,
    verification: 'unverified',
  },
  {
    id: 'df-inv-2',
    label: 'Prior Investigations',
    value: 'Hemoglobin 10.2 g/dL',
    source: 'Document',
    confidence: 0.55,
    needsVerification: true,
    verification: 'unverified',
  },
];

export const AYUSH_FIELDS: ClinicalField[] = [
  { id: 'ay-1', label: 'Prakriti', value: 'Not Reported', source: 'Patient', verification: 'unverified' },
  { id: 'ay-2', label: 'Vikriti', value: 'Not Reported', source: 'Patient', verification: 'unverified' },
  { id: 'ay-3', label: 'Agni', value: 'Not Reported', source: 'Patient', verification: 'unverified' },
  { id: 'ay-4', label: 'Koshtha', value: 'Not Reported', source: 'Patient', verification: 'unverified' },
  { id: 'ay-5', label: 'Ahara', value: 'Not Reported', source: 'Patient', verification: 'unverified' },
  { id: 'ay-6', label: 'Vihara', value: 'Not Reported', source: 'Patient', verification: 'unverified' },
  { id: 'ay-7', label: 'Dashavidha Pariksha', value: 'Not Reported', source: 'Patient', verification: 'unverified' },
];

export const OTHER_PATIENTS = [
  { name: 'Sunita Devi', meta: '43 | Female | General Medicine', status: 'In Queue', abha: true },
  { name: 'Mohammed Irfan', meta: '65 | Male | Pulmonology', status: 'Priority Triage', abha: true },
  { name: 'Anita Sharma', meta: '34 | Female | Obstetrics', status: 'In Queue', abha: false },
  { name: 'Vijay Prasad', meta: '71 | Male | Cardiology', status: 'Awaiting Consent', abha: true },
];
