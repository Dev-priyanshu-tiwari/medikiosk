import React, { useState } from 'react';
import clsx from 'clsx';
import { PageTitle, Card, Badge } from '../ui';

export function SettingsPage() {
  const [kioskLang, setKioskLang] = useState('Hindi + English');
  const [ayush, setAyush] = useState(false);

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="Settings" sub="Prototype configuration (no real hospital data)" />

      <Card className="p-6">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">Kiosk language</h3>
        <div className="mt-3 flex gap-2">
          {['Hindi', 'English', 'Hindi + English'].map((l) => (
            <button
              key={l}
              onClick={() => setKioskLang(l)}
              className={clsx(
                'rounded-xl px-4 py-2 text-sm font-bold ring-1 transition',
                kioskLang === l ? 'bg-teal-600 text-white ring-teal-600' : 'bg-white text-slate-600 ring-slate-200 hover:ring-teal-300'
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <h3 className="mt-8 text-sm font-extrabold uppercase tracking-wider text-slate-500">Modes shown on kiosk</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="blue">Allopathy</Badge>
          <button
            onClick={() => setAyush((a) => !a)}
            className={clsx(
              'rounded-full px-3 py-0.5 text-xs font-semibold ring-1 transition',
              ayush ? 'bg-primary-600 text-white ring-primary-600' : 'bg-white text-slate-500 ring-slate-200'
            )}
          >
            AYUSH {ayush ? '(enabled)' : '(disabled)'}
          </button>
        </div>
        {ayush && (
          <p className="mt-3 rounded-xl bg-primary-50 p-3 text-sm text-primary-700">
            AYUSH intake shows: Prakriti, Vikriti, Agni, Koshtha, Ahara, Vihara, Dashavidha Pariksha (demo fields,
            all “Not Reported” until patient answers).
          </p>
        )}

        <h3 className="mt-8 text-sm font-extrabold uppercase tracking-wider text-slate-500">Safety guardrails</h3>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
          <li>✓ No diagnosis output — flags are triage prompts only</li>
          <li>✓ No prescriptions or treatment recommendations</li>
          <li>✓ Missing answers render as “Not Reported”</li>
          <li>✓ Low-confidence OCR is marked “Needs physician verification”</li>
          <li>✓ Red flags always route to a human reviewer</li>
        </ul>
      </Card>
    </div>
  );
}
