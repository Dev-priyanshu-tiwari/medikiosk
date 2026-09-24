import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Hospital,
  ShieldCheck,
  Stethoscope,
  Volume2,
} from 'lucide-react';
import { Button, Card, Badge } from '../../ui';
import { useKioskCtx } from '../KioskContext';
import { useToasts } from '../../toast';

export function Consent() {
  const navigate = useNavigate();
  const { identity } = useKioskCtx();
  const { toast } = useToasts();
  const [checked, setChecked] = useState(false);

  const listen = (which: 'hi' | 'en') => {
    toast('info', which === 'hi' ? 'हिन्दी ऑडियो चल रहा है… (डेमो)' : 'Playing English audio… (demo)');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => navigate('/kiosk/identify')}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-800">Your information, your choice</h1>
      <p className="mt-1 text-slate-500">
        Before we start, please understand what happens with your information.
      </p>

      {/* Privacy items */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { icon: <Stethoscope className="h-7 w-7" />, title: 'Clinical history', sub: 'What you tell us today' },
          { icon: <FileText className="h-7 w-7" />, title: 'Medical documents', sub: 'Reports you upload here' },
          { icon: <Hospital className="h-7 w-7" />, title: 'Hospital record', sub: 'Linked with your ABHA' },
        ].map((i) => (
          <Card key={i.title} className="p-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">{i.icon}</div>
            <p className="font-bold text-slate-800">{i.title}</p>
            <p className="mt-0.5 text-sm text-slate-400">{i.sub}</p>
          </Card>
        ))}
      </div>

      {/* Listen controls */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => listen('hi')}>
          <Volume2 className="h-5 w-5" /> Listen in Hindi
        </Button>
        <Button variant="outline" onClick={() => listen('en')}>
          <Volume2 className="h-5 w-5" /> Listen in English
        </Button>
      </div>

      {/* Explanation */}
      <Card className="mt-6 border-l-4 border-teal-500 p-6">
        <p className="text-lg leading-relaxed text-slate-700">
          MediKiosk collects your story and your documents so your doctor understands you better — before you
          walk in. Nothing is shared outside this session, and a doctor always makes the final decision.
        </p>
        <p className="mt-3 text-sm font-medium text-teal-700">
          Your information will only be used for your healthcare session.
        </p>
      </Card>

      {/* Consent control */}
      <button
        onClick={() => setChecked((c) => !c)}
        className={clsx(
          'mt-8 flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left ring-2 transition-all active:scale-[0.99]',
          checked ? 'ring-teal-500 bg-teal-50/50' : 'ring-slate-200 hover:ring-teal-300'
        )}
        role="checkbox"
        aria-checked={checked}
      >
        <span
          className={clsx(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 transition-colors',
            checked ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'
          )}
        >
          {checked && <ShieldCheck className="h-5 w-5" />}
        </span>
        <span className="text-lg font-bold text-slate-700">I understand and consent</span>
      </button>

      {/* Footer buttons */}
      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm text-slate-400">
          {identity.name ? `Identified as ${identity.name}` : 'Not identified yet'}
        </span>
        <Button
          size="lg"
          variant="teal"
          disabled={!checked}
          onClick={() => {
            navigate('/kiosk/history');
          }}
        >
          Give Consent & Continue <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
