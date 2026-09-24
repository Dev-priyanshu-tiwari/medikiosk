import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {
  Activity,
  AlertTriangle,
  Check,
  FileText,
  FlaskConical,
  HeartPulse,
  Image as ImageIcon,
  Info,
  Pill,
  ShieldCheck,
  Stethoscope,
  X,
} from 'lucide-react';
import type { SourceKind, TimelineEvent, UploadedDoc } from './types';

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */
type BtnVariant = 'primary' | 'teal' | 'outline' | 'ghost' | 'danger' | 'success' | 'white';
type BtnSize = 'lg' | 'md' | 'sm';

const BTN_VARIANTS: Record<BtnVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-card',
  teal: 'bg-teal-600 text-white hover:bg-teal-700 shadow-card',
  outline: 'border-2 border-slate-300 bg-white text-slate-700 hover:border-primary-400 hover:text-primary-700',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-card',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-card',
  white: 'bg-white text-teal-700 hover:bg-teal-50 shadow-card',
};

const BTN_SIZES: Record<BtnSize, string> = {
  lg: 'px-8 py-4 text-lg min-h-[64px]',
  md: 'px-5 py-3 text-base min-h-[48px]',
  sm: 'px-3.5 py-2 text-sm min-h-[40px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize }) {
  return (
    <button className={clsx('kiosk-btn', BTN_VARIANTS[variant], BTN_SIZES[size], className)} {...rest}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Badges & tags                                                       */
/* ------------------------------------------------------------------ */
export function Badge({
  tone = 'slate',
  className,
  children,
}: {
  tone?: 'slate' | 'teal' | 'blue' | 'amber' | 'rose' | 'emerald';
  className?: string;
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600 ring-slate-200',
    teal: 'bg-teal-50 text-teal-700 ring-teal-200',
    blue: 'bg-primary-50 text-primary-700 ring-primary-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function SourceTag({ source }: { source: SourceKind }) {
  const map: Record<SourceKind, { tone: 'teal' | 'blue' | 'amber'; icon: React.ReactNode }> = {
    Patient: { tone: 'teal', icon: <Activity className="h-3 w-3" /> },
    Document: { tone: 'blue', icon: <FileText className="h-3 w-3" /> },
    'AI Flag': { tone: 'amber', icon: <Sparkle /> },
  };
  const { tone, icon } = map[source];
  return (
    <Badge tone={tone} className="uppercase tracking-wide">
      {icon}
      {source}
    </Badge>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  );
}

/* Confidence bar with color by score */
export function Confidence({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const tone = pct >= 85 ? 'bg-emerald-500' : pct >= 65 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <span className="inline-flex items-center gap-2" title={`AI confidence ${pct}%`}>
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-200">
        <span className={clsx('block h-full rounded-full', tone)} style={{ width: `${pct}%` }} />
      </span>
      <span className="text-xs font-semibold text-slate-500">{pct}%</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Cards & layout                                                      */
/* ------------------------------------------------------------------ */
export function Card({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-card',
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
      {icon}
      {children}
    </h3>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Kiosk stepper                                                       */
/* ------------------------------------------------------------------ */
const STEPS = ['Identify', 'Consent', 'History', 'Documents', 'Summary'];

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1.5">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex items-center gap-1.5">
            <div
              className={clsx(
                'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
                active && 'bg-teal-600 text-white shadow-card',
                done && 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
                !done && !active && 'text-slate-400'
              )}
            >
              <span
                className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                  active && 'bg-white/20 text-white',
                  done && 'bg-teal-600 text-white',
                  !done && !active && 'bg-slate-100 text-slate-400'
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="hidden md:inline">{s}</span>
            </div>
            {i < STEPS.length - 1 && <span className="h-0.5 w-4 rounded bg-slate-200" />}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */
export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-card-lg ring-1 ring-slate-200 animate-pop">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm text-slate-600">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */
export function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-10 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-300 ring-1 ring-slate-200">
        {icon}
      </div>
      <p className="font-semibold text-slate-500">{title}</p>
      {sub && <p className="mt-1 max-w-sm text-sm text-slate-400">{sub}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline (shared kiosk + dashboard)                                 */
/* ------------------------------------------------------------------ */
const EVENT_ICON: Record<TimelineEvent['type'], React.ReactNode> = {
  'Hospital admission': <Stethoscope className="h-5 w-5" />,
  Prescription: <Pill className="h-5 w-5" />,
  'Lab report': <FlaskConical className="h-5 w-5" />,
  'Current visit': <HeartPulse className="h-5 w-5" />,
  Other: <FileText className="h-5 w-5" />,
};

const ACCENT_RING: Record<TimelineEvent['accent'], string> = {
  teal: 'bg-teal-50 text-teal-600 ring-teal-200',
  blue: 'bg-primary-50 text-primary-600 ring-primary-200',
  amber: 'bg-amber-50 text-amber-600 ring-amber-200',
  rose: 'bg-rose-50 text-rose-600 ring-rose-200',
};

const ACCENT_LINE: Record<TimelineEvent['accent'], string> = {
  teal: 'bg-teal-200',
  blue: 'bg-primary-200',
  amber: 'bg-amber-200',
  rose: 'bg-rose-200',
};

export function Timeline({ events, compact }: { events: TimelineEvent[]; compact?: boolean }) {
  return (
    <div className="relative">
      {events.map((e, i) => (
        <div key={e.id} className="relative flex gap-4 pb-6 last:pb-0">
          {/* vertical line */}
          {i < events.length - 1 && (
            <span className={clsx('absolute left-[27px] top-14 bottom-0 w-0.5 rounded', ACCENT_LINE[e.accent])} />
          )}
          {/* year bubble */}
          <div className="z-10 flex w-14 flex-col items-center">
            <div className={clsx('flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-1', ACCENT_RING[e.accent])}>
              {EVENT_ICON[e.type]}
            </div>
          </div>
          <Card className="flex-1 p-4 animate-fade-up">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{e.year}</span>
              <span className="text-sm font-bold text-slate-700">{e.title}</span>
              <span className="text-xs text-slate-400">· {e.dateLabel}</span>
              <Badge tone="slate" className="ml-auto">
                {e.docLabel}
              </Badge>
              {compact && (
                <Badge tone={e.source === 'Patient' ? 'teal' : 'blue'}>
                  {e.source === 'Patient' ? 'Patient' : 'Document'}
                </Badge>
              )}
            </div>
            <ul className="mt-2 space-y-1">
              {e.details.map((d) => (
                <li key={d} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  {d}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Document thumbnails                                                 */
/* ------------------------------------------------------------------ */
export function DocThumb({ doc, className }: { doc: UploadedDoc; className?: string }) {
  const icon =
    doc.kind === 'Lab Report' ? (
      <FlaskConical className="h-7 w-7" />
    ) : doc.kind === 'Prescription' ? (
      <Pill className="h-7 w-7" />
    ) : (
      <FileText className="h-7 w-7" />
    );
  return (
    <div
      className={clsx(
        'relative flex h-24 w-20 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400',
        doc.fileName.endsWith('.pdf') ? 'border-rose-200' : 'border-slate-200',
        className
      )}
    >
      {icon}
      <span className="px-1 text-center text-[9px] font-bold uppercase tracking-wide text-slate-400">
        {doc.kind}
      </span>
      {doc.status !== 'done' && (
        <span className="absolute inset-0 flex items-center justify-center bg-white/70">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simple typed input                                                  */
/* ------------------------------------------------------------------ */
export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-lg text-slate-800 placeholder:text-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:bg-slate-50"
      />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Small hook: cycling text for AI typing animation                    */
/* ------------------------------------------------------------------ */
export function useTypewriter(text: string, speed = 28) {
  const [out, setOut] = useState('');
  useEffect(() => {
    setOut('');
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return out;
}
