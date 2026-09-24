import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarClock } from 'lucide-react';
import { Button, Card, Timeline } from '../../ui';
import { DEMO_TIMELINE } from '../../demo';
import { useKioskCtx } from '../KioskContext';

export function KioskTimeline() {
  const navigate = useNavigate();
  const { identity } = useKioskCtx();

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => navigate('/kiosk/documents')}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <CalendarClock className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Your medical timeline</h1>
          <p className="text-slate-500">
            Everything the doctor should know, in one place{identity.name ? `, ${identity.name.split(' ')[0]}` : ''}.
          </p>
        </div>
      </div>

      <Card className="mt-8 p-6">
        <Timeline events={DEMO_TIMELINE} />
      </Card>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/kiosk/documents')}>
          <ArrowLeft className="h-4 w-4" /> Documents
        </Button>
        <Button size="lg" variant="teal" onClick={() => navigate('/kiosk/summary')}>
          Final Summary <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
