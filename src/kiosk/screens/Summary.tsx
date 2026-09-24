import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  HeartPulse,
  Leaf,
  Pill,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { AYUSH_FIELDS } from '../../demo';
import { Button, Card, Badge, Modal } from '../../ui';
import { useKioskCtx } from '../KioskContext';
import { useToasts } from '../../toast';

interface SummaryCard {
  icon: React.ReactNode;
  tone: string;
  title: string;
  items: string[];
  danger?: boolean;
}

const CARDS: SummaryCard[] = [
  {
    icon: <HeartPulse className="h-6 w-6" />,
    tone: 'bg-rose-50 text-rose-600',
    title: 'Chief Complaint',
    items: ['Chest pain × 3 days'],
  },
  {
    icon: <Activity className="h-6 w-6" />,
    tone: 'bg-primary-50 text-primary-600',
    title: 'Current Symptoms',
    items: ['Exertional worsening', 'Breathlessness'],
  },
  {
    icon: <ClipboardList className="h-6 w-6" />,
    tone: 'bg-teal-50 text-teal-600',
    title: 'Past History',
    items: ['Hypertension', 'Diabetes'],
  },
  {
    icon: <Pill className="h-6 w-6" />,
    tone: 'bg-primary-50 text-primary-600',
    title: 'Medications',
    items: ['Amlodipine 5 mg', 'Metformin 500 mg'],
  },
  {
    icon: <FileText className="h-6 w-6" />,
    tone: 'bg-slate-100 text-slate-500',
    title: 'Allergies',
    items: ['Not Reported'],
  },
  {
    icon: <ShieldAlert className="h-6 w-6" />,
    tone: 'bg-rose-50 text-rose-600',
    title: 'Red Flag',
    items: ['Priority human triage recommended'],
    danger: true,
  },
];

export function Summary() {
  const navigate = useNavigate();
  const { identity, triage, mode } = useKioskCtx();
  const { toast } = useToasts();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* AYUSH mode: additional Ayurvedic history fields (demo) */
  const ayushCards: SummaryCard[] =
    mode === 'ayush'
      ? [
          {
            icon: <Leaf className="h-6 w-6" />,
            tone: 'bg-emerald-50 text-emerald-700',
            title: 'AYUSH History',
            items: AYUSH_FIELDS.map((f) => `${f.label}: ${f.value}`),
          },
        ]
      : [];

  const submit = () => {
    setSubmitted(true);
    toast('success', 'Your history has been sent to the doctor.');
    setTimeout(() => navigate('/kiosk/submitted'), 1200);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 animate-pop">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">Your information is ready</h1>
        <p className="mt-3 text-lg text-slate-500">Your history has been sent to the doctor.</p>
        <p className="mt-1 text-sm text-slate-400">Please wait — you will be called shortly.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Button variant="ghost" size="sm" onClick={() => navigate('/kiosk/timeline')}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-800">Your information is ready</h1>
      <p className="mt-1 text-slate-500">The doctor will see exactly this — clear and complete.</p>

      {/* Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...CARDS, ...ayushCards].map((c) => (
          <Card key={c.title} className={clsx('p-5', c.danger && 'ring-2 ring-rose-300 animate-pop')}>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl">
              <span className={clsx('flex h-11 w-11 items-center justify-center rounded-xl', c.tone)}>{c.icon}</span>
            </div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-400">{c.title}</p>
            <ul className="mt-2 space-y-1">
              {c.items.map((i) => (
                <li
                  key={i}
                  className={clsx(
                    'text-base font-semibold',
                    c.danger ? 'text-rose-700' : i === 'Not Reported' ? 'text-slate-400' : 'text-slate-700'
                  )}
                >
                  {i}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pb-4">
        <Button size="lg" variant="outline" onClick={() => setReviewOpen(true)}>
          <Eye className="h-5 w-5" /> Review
        </Button>
        <Button size="lg" variant="teal" onClick={submit}>
          <Send className="h-5 w-5" /> Submit to Doctor
        </Button>
      </div>

      {/* Review modal */}
      <Modal
        open={reviewOpen}
        title="Review your information"
        onClose={() => setReviewOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setReviewOpen(false)}>
              Close
            </Button>
            <Button variant="teal" onClick={submit}>
              <Send className="h-5 w-5" /> Submit to Doctor
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          {CARDS.flatMap((c) => c.items.map((i) => ({ title: c.title, item: i }))).map(({ title, item }) => (
            <div key={title + item} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-sm text-slate-500">{title}</span>
              <span className="text-sm font-semibold text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
