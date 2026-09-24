/* MediKiosk domain types — structured JSON internally, never exposed raw to patients. */

export type Lang = 'hi' | 'en';

export type System = 'allopathy' | 'ayush';

export type SourceKind = 'Patient' | 'Document' | 'AI Flag';

export type VerificationState = 'unverified' | 'verified' | 'rejected' | 'edited';

export interface ClinicalField {
  id: string;
  label: string;
  labelHi?: string;
  value: string;
  valueHi?: string;
  source: SourceKind;
  confidence?: number; // 0-1, for AI/Document derived
  needsVerification?: boolean; // e.g. unclear OCR
  verification: VerificationState;
}

export interface PatientIdentity {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  department: string;
  abhaId: string;
  abhaVerified: boolean;
  mode: System;
}

export interface Medication {
  name: string;
  dose: string;
  sourceDocId: string;
  confidence: number;
}

export interface Investigation {
  name: string;
  value: string;
  sourceDocId: string;
  confidence: number;
  needsVerification?: boolean;
}

export interface ConversationTurn {
  role: 'ai' | 'patient';
  text: string;
  lang?: Lang;
  at: number;
  fieldId?: string; // clinical field this answer maps to
}

export interface UploadedDoc {
  id: string;
  fileName: string;
  kind: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Other Report';
  sizeLabel: string;
  status: 'queued' | 'reading' | 'extracting' | 'timeline' | 'done' | 'failed';
  extractionProgress: number; // 0-100
  extracted?: {
    medications?: Medication[];
    investigations?: Investigation[];
    conditions?: { name: string; confidence: number; needsVerification?: boolean }[];
    rawLines?: string[];
  };
}

export interface TimelineEvent {
  id: string;
  year: string;
  dateLabel: string;
  type: 'Hospital admission' | 'Prescription' | 'Lab report' | 'Current visit' | 'Other';
  docLabel: string;
  docId?: string;
  title: string;
  details: string[];
  source: SourceKind;
  accent: 'teal' | 'blue' | 'amber' | 'rose';
}

export interface RedFlag {
  id: string;
  label: string;
  labelHi?: string;
  rationale: string;
  triageStatus: string;
}

export interface PatientRecord {
  /* The single structured object that flows through the entire prototype. */
  identity: PatientIdentity;
  chiefComplaint: ClinicalField;
  hpi: ClinicalField[];
  pastHistory: ClinicalField[];
  medications: ClinicalField[];
  allergies: ClinicalField[];
  familyHistory: ClinicalField[];
  personalHistory: ClinicalField[];
  investigations: ClinicalField[];
  ayushHistory: ClinicalField[];
  redFlags: RedFlag[];
  triageStatus: 'Normal' | 'Priority Triage';
  documents: UploadedDoc[];
  timeline: TimelineEvent[];
  transcript: ConversationTurn[];
  historyProgress: number; // 0-100
  historyComplete: boolean;
  consent: boolean;
  consentAt?: number;
  language: Lang;
  submittedAt?: number;
  acceptedByDoctor?: boolean;
}

export interface Toast {
  id: number;
  kind: 'success' | 'info' | 'warn' | 'error';
  message: string;
}
