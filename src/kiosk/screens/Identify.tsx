import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Keyboard,
  Loader2,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Button, Card, SectionLabel, TextInput, Badge } from '../../ui';
import { useKioskCtx } from '../KioskContext';
import { useToasts } from '../../toast';

import type { PatientIdentity } from '../../types';

type Method = 'scan' | 'enter' | 'new';

export function Identify() {
  const navigate = useNavigate();
  const { identity, setIdentity, isDemo, loadDemo } = useKioskCtx();
  const { toast } = useToasts();
  const [method, setMethod] = useState<Method | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    department: 'Cardiology',
    abha: '',
  });

  const start = (m: Method) => {
    if (m === 'new') {
      // Demo patient details prefilled for demo purposes
      loadDemo();
    }
    setMethod(m);
  };

  const runVerify = () => {
    if (!form.name || !form.age) {
      toast('warn', 'Please enter name and age to continue.');
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      setIdentity({
        name: form.name,
        age: Number(form.age),
        gender: (form.gender === 'Female' ? 'Female' : form.gender === 'Other' ? 'Other' : 'Male') as PatientIdentity['gender'],
        department: form.department,
        abhaId: form.abha,
        abhaVerified: true,
      });
      toast('success', 'ABHA verified (demo)');
    }, 1400);
  };

  const canContinue = verified || isDemo;

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => navigate('/kiosk')}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-800">Let's identify you</h1>
      <p className="mt-1 text-slate-500">Choose any one method. Nothing is typed if you prefer to speak.</p>

      {/* Method cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MethodCard
          icon={<CreditCard className="h-8 w-8" />}
          title="Scan ABHA"
          sub="Scan your ABHA card / QR"
          active={method === 'scan'}
          onClick={() => start('scan')}
        />
        <MethodCard
          icon={<Keyboard className="h-8 w-8" />}
          title="Enter ABHA"
          sub="Type your ABHA number"
          active={method === 'enter'}
          onClick={() => start('enter')}
        />
        <MethodCard
          icon={<UserPlus className="h-8 w-8" />}
          title="New Patient"
          sub="Quick details (demo ready)"
          active={method === 'new'}
          onClick={() => start('new')}
        />
      </div>

      {/* Panels */}
      {method === 'scan' && (
        <Card className="mt-6 p-6 animate-fade-up">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative flex h-40 w-56 items-center justify-center overflow-hidden rounded-xl bg-slate-900/90">
              <div className="absolute left-0 right-0 h-1 bg-teal-400/80 animate-scanline" />
              <div className="grid grid-cols-6 gap-1 p-4 opacity-90">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-4 w-4 rounded-sm ${i % 3 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-500">Hold the card steady… (demo scan)</p>
            <Button
              variant="teal"
              onClick={() => {
                setVerifying(true);
                setTimeout(() => {
                  setVerifying(false);
                  setVerified(true);
                  setIdentity({ abhaVerified: true });
                  toast('success', 'ABHA verified (demo)');
                }, 1500);
              }}
            >
              Simulate Scan
            </Button>
          </div>
        </Card>
      )}

      {method === 'enter' && (
        <Card className="mt-6 p-6 animate-fade-up">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Patient Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Full name" />
            <TextInput label="Age" value={form.age} onChange={(v) => setForm({ ...form, age: v.replace(/\D/g, '') })} placeholder="Years" />
            <TextInput label="Gender" value={form.gender} onChange={(v) => setForm({ ...form, gender: v })} />
            <TextInput label="Department" value={form.department} onChange={(v) => setForm({ ...form, department: v })} />
            <div className="md:col-span-2">
              <TextInput label="ABHA Address / Number" value={form.abha} onChange={(v) => setForm({ ...form, abha: v })} placeholder="12-3456-7890-1234" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Button variant="teal" onClick={runVerify} disabled={verifying}>
              {verifying ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
              {verifying ? 'Verifying ABHA…' : 'Verify & Continue'}
            </Button>
            {verified && <Badge tone="emerald"><BadgeCheck className="h-4 w-4" /> ABHA Verified</Badge>}
          </div>
        </Card>
      )}

      {method === 'new' && (
        <Card className="mt-6 p-6 animate-fade-up">
          <SectionLabel>Demo details ready</SectionLabel>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <TextInput label="Patient Name" value={identity.name} onChange={(v) => setIdentity({ name: v })} />
            <TextInput label="Age" value={String(identity.age)} onChange={(v) => setIdentity({ age: Number(v.replace(/\D/g, '')) || 0 })} />
            <TextInput label="Gender" value={identity.gender} onChange={(v) => setIdentity({ gender: v as PatientIdentity['gender'] })} />
            <TextInput label="Department" value={identity.department} onChange={(v) => setIdentity({ department: v })} />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Badge tone="emerald"><BadgeCheck className="h-4 w-4" /> ABHA Verified</Badge>
            <span className="text-sm text-slate-400">ABHA {identity.abhaId}</span>
          </div>
        </Card>
      )}

      {/* Continue bar */}
      <div className="mt-8 flex items-center justify-between">
        {canContinue ? (
          <Badge tone="emerald" className="text-sm">
            <BadgeCheck className="h-4 w-4" /> ABHA Verified
          </Badge>
        ) : (
          <span className="text-sm text-slate-400">Verify details to continue</span>
        )}
        <Button size="lg" variant="teal" disabled={!canContinue} onClick={() => navigate('/kiosk/consent')}>
          Continue <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

function MethodCard({
  icon,
  title,
  sub,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-2xl bg-white p-6 text-left ring-2 transition-all active:scale-[0.98]',
        active ? 'ring-teal-500 shadow-kiosk' : 'ring-slate-200 hover:ring-teal-300'
      )}
    >
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-teal-600">{icon}</div>
      <p className="text-lg font-bold text-slate-800">{title}</p>
      <p className="mt-0.5 text-sm text-slate-400">{sub}</p>
    </button>
  );
}
