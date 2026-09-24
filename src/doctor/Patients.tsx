import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronRight, UserRound } from 'lucide-react';
import { Badge, Card, PageTitle } from '../ui';
import { OTHER_PATIENTS } from '../demo';

export function Patients() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Patients" sub="Patients who completed kiosk intake today" />
      <div className="space-y-3">
        <PatientRow name="Rajesh Kumar" meta="57 | Male | Cardiology · ABHA Verified" status="Priority Triage" highlight />
        {OTHER_PATIENTS.map((p) => (
          <PatientRow key={p.name} name={p.name} meta={`${p.meta}${p.abha ? ' · ABHA Verified' : ''}`} status={p.status} />
        ))}
      </div>
    </div>
  );
}

function PatientRow({
  name,
  meta,
  status,
  highlight,
}: {
  name: string;
  meta: string;
  status: string;
  highlight?: boolean;
}) {
  const navigate = useNavigate();
  const tone =
    status === 'Priority Triage'
      ? 'rose'
      : status === 'Awaiting Consent'
      ? 'amber'
      : status === 'In Queue'
      ? 'teal'
      : 'slate';
  return (
    <Card
      className={clsx(
        'flex cursor-pointer items-center gap-4 p-5 transition hover:shadow-card-lg',
        highlight && 'ring-2 ring-rose-300'
      )}
      onClick={() => navigate('/doctor')}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
        <UserRound className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-800">{name}</p>
        <p className="text-sm text-slate-400">{meta}</p>
      </div>
      <Badge tone={tone as never}>{status}</Badge>
      <ChevronRight className="h-5 w-5 text-slate-300" />
    </Card>
  );
}
