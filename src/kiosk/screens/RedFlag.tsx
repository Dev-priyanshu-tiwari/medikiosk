import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BellRing, Check, PhoneCall, ShieldAlert } from 'lucide-react';
import { Button, Card, Badge } from '../../ui';
import { useKioskCtx } from '../KioskContext';
import { useToasts } from '../../toast';

export function RedFlag() {
  const navigate = useNavigate();
  const { setTriage } = useKioskCtx();
  const { toast } = useToasts();
  const [alerted, setAlerted] = useState(false);
  const [priority, setPriority] = useState(false);

  const alertStaff = () => {
    setAlerted(true);
    setTriage('Priority Triage');
    toast('success', 'Triage staff alerted. Please wait at the kiosk.');
  };

  const continuePriority = () => {
    setPriority(true);
    setTriage('Priority Triage');
    toast('success', 'You are marked as Priority Triage.');
    setTimeout(() => navigate('/kiosk/documents'), 700);
  };

  return (
    <div className="mx-auto max-w-2xl text-center">
      {/* Pulsing warning icon */}
      <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-rose-400/25 animate-pulse-ring" />
        <span className="absolute inset-2 rounded-full bg-rose-400/25 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-600 text-white shadow-kiosk animate-pop">
          <ShieldAlert className="h-12 w-12" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-5 py-2 ring-1 ring-rose-200">
        <span className="h-2.5 w-2.5 animate-blink rounded-full bg-rose-500" />
        <span className="text-sm font-extrabold uppercase tracking-widest text-rose-600">Potential Red Flag</span>
      </div>

      <h1 className="mt-5 text-3xl font-extrabold text-slate-800">
        Symptoms may require priority human triage.
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-lg text-slate-500">
        MediKiosk does not diagnose. A healthcare professional should review this immediately.
      </p>

      {/* Observed pattern (careful wording, no diagnosis) */}
      <Card className="mx-auto mt-8 max-w-xl p-6 text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">What the kiosk noticed</p>
        <ul className="mt-3 space-y-2 text-base text-slate-700">
          <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />Chest pain reported for 3 days</li>
          <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />Worse when walking</li>
          <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />Breathlessness reported</li>
        </ul>
        <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-400">
          This is not a diagnosis — only a prompt for a nurse or doctor to review sooner.
        </p>
      </Card>

      {/* Status chip */}
      <div className="mt-6">
        <Badge tone="rose" className="text-sm">
          Status: Priority Triage
        </Badge>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" variant={alerted ? 'success' : 'danger'} onClick={alertStaff} disabled={alerted}>
          {alerted ? <Check className="h-6 w-6" /> : <BellRing className="h-6 w-6" />}
          {alerted ? 'Triage staff alerted' : 'Alert Triage Staff'}
        </Button>
        <Button size="lg" variant="outline" onClick={continuePriority} disabled={priority}>
          Continue With Priority <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
      {alerted && (
        <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700">
          <PhoneCall className="h-4 w-4" /> A nurse has been notified (demo).
        </p>
      )}
    </div>
  );
}
