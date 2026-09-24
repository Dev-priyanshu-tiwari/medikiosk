import React from 'react';
import clsx from 'clsx';
import { Badge, Card, PageTitle } from '../ui';
import { OTHER_PATIENTS } from '../demo';
import { Clock, ShieldAlert } from 'lucide-react';

const QUEUE = [
  { token: 'T-012', name: 'Rajesh Kumar', meta: '57 | Male | Cardiology', status: 'Priority Triage', wait: 'Now' },
  { token: 'T-013', name: OTHER_PATIENTS[0].name, meta: OTHER_PATIENTS[0].meta, status: 'Waiting', wait: '~10 min' },
  { token: 'T-014', name: OTHER_PATIENTS[1].name, meta: OTHER_PATIENTS[1].meta, status: 'Waiting', wait: '~25 min' },
  { token: 'T-015', name: OTHER_PATIENTS[2].name, meta: OTHER_PATIENTS[2].meta, status: 'Intake in progress', wait: '~40 min' },
];

export function Queue() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="Current Queue" sub="Ordered by triage priority, then token number" />
      <div className="space-y-3">
        {QUEUE.map((q, i) => {
          const priority = q.status === 'Priority Triage';
          return (
            <Card key={q.token} className={clsx('flex items-center gap-4 p-5', priority && 'ring-2 ring-rose-300')}>
              <div
                className={clsx(
                  'flex h-12 w-14 items-center justify-center rounded-xl text-sm font-extrabold',
                  priority ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
                )}
              >
                {q.token}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-slate-800">{q.name}</p>
                  {priority && (
                    <Badge tone="rose">
                      <ShieldAlert className="h-3.5 w-3.5" /> Priority Triage
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-400">{q.meta}</p>
              </div>
              <div className="text-right">
                <p className={clsx('text-sm font-bold', priority ? 'text-rose-600' : 'text-slate-500')}>{q.wait}</p>
                <p className="flex items-center justify-end gap-1 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" /> {i === 0 ? 'Called next' : 'Estimated'}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
