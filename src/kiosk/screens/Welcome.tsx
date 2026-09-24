import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Languages, Play, Sparkles } from 'lucide-react';
import { Button } from '../../ui';
import { useKioskCtx } from '../KioskContext';
import { useToasts } from '../../toast';

export function Welcome() {
  const navigate = useNavigate();
  const { lang, setLang, loadDemo } = useKioskCtx();
  const { toast } = useToasts();

  const goIdentify = () => navigate('/kiosk/identify');

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* Hero icon */}
      <div className="relative mb-8 animate-pop">
        <span className="absolute inset-0 rounded-3xl bg-teal-400/30 animate-pulse-ring" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-teal-600 text-white shadow-kiosk">
          <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      </div>

      <h1 className="max-w-3xl text-balance text-4xl font-extrabold leading-tight text-slate-800 md:text-5xl">
        Complete your medical history before your consultation.
      </h1>
      <p className="mt-4 text-xl text-slate-500">
        Speak, tap or listen. No complicated forms.
      </p>
      <p className="mt-1 text-lg font-semibold text-teal-700">
        {lang === 'hi' ? 'आपकी कहानी आपसे पहले डॉक्टर तक पहुँचती है।' : 'Your story reaches the doctor before you do.'}
      </p>

      {/* Language selection */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => setLang('hi')}
          className={clsxBilingual(lang === 'hi')}
        >
          हिन्दी
        </button>
        <button
          onClick={() => setLang('en')}
          className={clsxBilingual(lang === 'en')}
        >
          English
        </button>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" variant="teal" className="px-12 text-xl" onClick={goIdentify}>
          Start <ArrowRight className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="px-8 text-lg"
          onClick={() => {
            loadDemo();
            toast('info', 'Demo patient loaded: Rajesh Kumar, 57 · Hindi · Cardiology');
            navigate('/kiosk/identify');
          }}
        >
          <Play className="h-5 w-5" /> Demo Patient
        </Button>
      </div>

      {/* Talk / Scan / Flag / Prepare strip */}
      <div className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: <MicIcon />, title: 'TALK', sub: 'Speak naturally' },
          { icon: <ScanIcon />, title: 'SCAN', sub: 'Old records → data' },
          { icon: <FlagIcon />, title: 'FLAG', sub: 'Urgency → human triage' },
          { icon: <PrepIcon />, title: 'PREPARE', sub: 'Doctor gets a summary' },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-card">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              {f.icon}
            </div>
            <p className="text-sm font-extrabold tracking-widest text-slate-700">{f.title}</p>
            <p className="mt-1 text-xs text-slate-400">{f.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function clsxBilingual(active: boolean) {
  return [
    'rounded-2xl px-8 py-4 text-2xl font-bold shadow-card transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300',
    active ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-primary-300',
  ].join(' ');
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4" />
    </svg>
  );
}
function ScanIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" />
    </svg>
  );
}
function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
    </svg>
  );
}
function PrepIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 12l2 2 4-4" />
      <rect x="3" y="4" width="18" height="16" rx="2" />
    </svg>
  );
}
