import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Stepper } from '../ui';
import { useKioskCtx } from './KioskContext';

const STEP_OF_SCREEN: Record<string, number> = {
  welcome: 0,
  identify: 0,
  consent: 1,
  history: 2,
  redflag: 2,
  documents: 3,
  timeline: 3,
  summary: 4,
  submitted: 4,
};

export function KioskLayout({ children }: { children: React.ReactNode }) {
  const { lang, mode, setMode } = useKioskCtx();
  const location = useLocation();
  const screen = location.pathname.split('/').pop() || 'welcome';
  const [logoSrc, setLogoSrc] = useState('/kiosklogo.jpeg');
  const [logoFailed, setLogoFailed] = useState(false);

  const handleLogoError = () => {
    if (logoSrc === '/kiosklogo.jpeg') {
      setLogoSrc('/logo.png');
    } else {
      setLogoFailed(true);
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-gradient-to-b from-teal-50/60 via-slate-50 to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            {!logoFailed ? (
              <img
                src={logoSrc}
                alt="MediKiosk"
                onError={handleLogoError}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            ) : (
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 sm:h-7 sm:w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                >
                  <path d="M12 4v16m-8-8h16" />
                </svg>
              </div>
            )}
            <div>
              <p className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-800">MediKiosk</p>
              <p className="text-[11px] sm:text-xs font-medium text-teal-700">
                {lang === 'hi'
                  ? 'आपकी कहानी आपसे पहले डॉक्टर तक पहुँचती है।'
                  : 'Your story reaches the doctor before you do.'}
              </p>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2.5 sm:gap-4">
            <Stepper current={STEP_OF_SCREEN[screen] ?? 0} />
            <div className="flex overflow-hidden rounded-full ring-1 ring-slate-200">
              <button
                onClick={() => setMode('allopathy')}
                className={clsx(
                  'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold transition-colors',
                  mode === 'allopathy'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                )}
              >
                Allopathy
              </button>
              <button
                onClick={() => setMode('ayush')}
                className={clsx(
                  'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold transition-colors',
                  mode === 'ayush'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                )}
              >
                AYUSH
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-6 sm:py-8">{children}</main>

      <footer className="border-t border-slate-200/70 bg-white/70 px-4 py-3 text-center text-xs text-slate-400">
        MediKiosk does not diagnose, prescribe or recommend treatment. A doctor always makes the final decision.
      </footer>
    </div>
  );
}
