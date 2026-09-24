import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEMO_PATIENT } from '../demo';
import type { Lang, PatientIdentity } from '../types';

/* ------------------------------------------------------------------ */
/* Kiosk-wide state (lightweight — this is a clickable prototype)      */
/* ------------------------------------------------------------------ */
export interface KioskCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  mode: 'allopathy' | 'ayush';
  setMode: (m: 'allopathy' | 'ayush') => void;
  identity: PatientIdentity;
  setIdentity: (p: Partial<PatientIdentity>) => void;
  isDemo: boolean;
  loadDemo: () => void;
  reset: () => void;
  triage: 'Normal' | 'Priority Triage';
  setTriage: (t: 'Normal' | 'Priority Triage') => void;
  redFlag: boolean;
  setRedFlag: (v: boolean) => void;
}

const Ctx = createContext<KioskCtx | null>(null);

const BLANK_IDENTITY: PatientIdentity = {
  name: '',
  age: 0,
  gender: 'Other',
  department: 'Cardiology',
  abhaId: '',
  abhaVerified: false,
  mode: 'allopathy',
};

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [mode, setMode] = useState<'allopathy' | 'ayush'>('allopathy');
  const [identity, setIdentityState] = useState<PatientIdentity>(BLANK_IDENTITY);
  const [isDemo, setIsDemo] = useState(false);
  const [triage, setTriage] = useState<'Normal' | 'Priority Triage'>('Normal');
  const [redFlag, setRedFlag] = useState(false);

  const value = useMemo<KioskCtx>(
    () => ({
      lang,
      setLang,
      mode,
      setMode,
      identity,
      setIdentity: (p) => setIdentityState((old) => ({ ...old, ...p })),
      isDemo,
      loadDemo: () => {
        setIdentityState(DEMO_PATIENT);
        setIsDemo(true);
        setLang('hi');
        setMode('allopathy');
      },
      reset: () => {
        setIdentityState(BLANK_IDENTITY);
        setIsDemo(false);
        setLang('en');
        setMode('allopathy');
        setTriage('Normal');
        setRedFlag(false);
      },
      triage,
      setTriage,
      redFlag,
      setRedFlag,
    }),
    [lang, mode, identity, isDemo, triage, redFlag]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useKioskCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useKioskCtx must be used within KioskProvider');
  return ctx;
}
