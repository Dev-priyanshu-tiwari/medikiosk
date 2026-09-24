import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home } from 'lucide-react';
import { Button, Card } from '../../ui';

export function Submitted() {
  return (
    <div className="mx-auto max-w-xl py-14 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 animate-pop">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-800">Your history has been sent to the doctor.</h1>
      <p className="mt-3 text-lg text-slate-500">
        Please take a seat — you will be called shortly.
      </p>

      <Card className="mt-8 p-6 text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">What happens next</p>
        <ol className="mt-3 space-y-2 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="font-bold text-teal-600">1.</span> A nurse reviews your summary (priority triage checked first).
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-teal-600">2.</span> Your doctor opens your pre-consultation summary before you enter.
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-teal-600">3.</span> You consult — no long forms at the counter.
          </li>
        </ol>
      </Card>

      <div className="mt-8 flex justify-center gap-3">
        <Link to="/kiosk">
          <Button variant="outline">
            <Home className="h-5 w-5" /> Back to Start
          </Button>
        </Link>
        <Link to="/doctor">
          <Button variant="teal">View Doctor Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
