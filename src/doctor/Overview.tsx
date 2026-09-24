import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  CalendarClock,
  CheckCheck,
  FileText,
  Pencil,
  RefreshCcw,
  Send,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Confidence,
  DocThumb,
  Modal,
  SectionLabel,
  SourceTag,
  Timeline,
} from '../ui';
import { DEMO_DOCS, DEMO_TIMELINE, DOCTOR_FIELDS } from '../demo';
import type { ClinicalField } from '../types';
import { useToasts } from '../toast';

type Override = { state: 'verified' | 'rejected' | 'edited'; value?: string };

export function Overview() {
  const { toast } = useToasts();
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [editing, setEditing] = useState<{ id: string; value: string } | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [confirmAccept, setConfirmAccept] = useState(false);
  const [reinterview, setReinterview] = useState(false);

  const apply = (id: string, o: Override, msg: string) => {
    setOverrides((m) => ({ ...m, [id]: o }));
    toast('success', msg);
  };

  const saveEdit = () => {
    if (!editing) return;
    apply(editing.id, { state: 'edited', value: editing.value }, 'Field updated by physician.');
    setEditing(null);
  };

  /* Group fields by label for display */
  const groups: { label: string; fields: ClinicalField[] }[] = [];
  for (const f of DOCTOR_FIELDS) {
    const g = groups.find((x) => x.label === f.label);
    if (g) g.fields.push(f);
    else groups.push({ label: f.label, fields: [f] });
  }

  return (
    <div className="space-y-8">
      {/* Patient card */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-5 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-2xl font-extrabold text-primary-700">
            RK
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-800">Rajesh Kumar</h2>
              <Badge tone="emerald">
                <BadgeCheck className="h-3.5 w-3.5" /> ABHA Verified
              </Badge>
              <Badge tone="rose" className="animate-blink">
                <ShieldAlert className="h-3.5 w-3.5" /> Priority Triage
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">57 | Male | Cardiology · ABHA 12-3456-7890-1234</p>
            <p className="text-xs text-slate-400">Pre-consultation information collected · Kiosk 2 · 09:41</p>
          </div>
          <div className="ml-auto flex gap-3">
            <Button variant="danger" onClick={() => toast('warn', 'Patient sent to triage nurse.')}>
              <Send className="h-4 w-4" /> Send to Triage
            </Button>
            <Link to="/doctor/documents">
              <Button variant="outline">View Documents</Button>
            </Link>
          </div>
        </div>
        {/* red flag strip */}
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-rose-50/60 px-6 py-3">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          <p className="text-sm font-bold text-rose-700">
            Red flags: Exertional chest pain + breathlessness
          </p>
          <span className="text-xs text-rose-400">Human review required before consultation</span>
        </div>
      </Card>

      {/* A. Clinical summary */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <SectionLabel icon={<Stethoscope className="h-4 w-4" />}>Section A</SectionLabel>
            <h2 className="text-xl font-bold text-slate-800">Pre-Consultation Summary</h2>
          </div>
          <Badge tone="teal">
            <Sparkles className="h-3.5 w-3.5" /> AI-drafted · physician verification required
          </Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((g) => (
            <Card key={g.label} className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">{g.label}</h3>
              </div>
              <div className="space-y-3">
                {g.fields.map((f) => {
                  const o = overrides[f.id];
                  const value = o?.state === 'edited' ? o.value ?? f.value : f.value;
                  return (
                    <div
                      key={f.id}
                      className={clsx(
                        'rounded-xl p-3 ring-1',
                        o?.state === 'rejected'
                          ? 'bg-slate-50 opacity-60 line-through ring-slate-200'
                          : o?.state === 'verified'
                          ? 'bg-emerald-50/60 ring-emerald-200'
                          : o?.state === 'edited'
                          ? 'bg-primary-50/50 ring-primary-200'
                          : 'bg-slate-50 ring-slate-200'
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={clsx('flex-1 font-semibold', o?.state === 'rejected' ? 'text-slate-500' : 'text-slate-700')}>
                          {value}
                        </p>
                        <SourceTag source={f.source} />
                        {f.confidence != null && f.source !== 'Patient' && <Confidence score={f.confidence} />}
                        {f.needsVerification && !o && <Badge tone="amber">Needs physician verification</Badge>}
                        {o?.state === 'verified' && (
                          <Badge tone="emerald">
                            <BadgeCheck className="h-3.5 w-3.5" /> Verified
                          </Badge>
                        )}
                        {o?.state === 'edited' && <Badge tone="blue">Edited by physician</Badge>}
                        {o?.state === 'rejected' && <Badge tone="slate">Rejected</Badge>}
                      </div>
                      {/* per-item actions for AI/document-derived rows */}
                      {f.source !== 'Patient' && (
                        <div className="mt-2 flex gap-2 border-t border-slate-200/70 pt-2">
                          <button
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                            onClick={() => apply(f.id, { state: 'verified' }, `Verified: ${value}`)}
                          >
                            <CheckCheck className="h-3.5 w-3.5" /> Verify
                          </button>
                          <button
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-primary-700 hover:bg-primary-50"
                            onClick={() => setEditing({ id: f.id, value })}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50"
                            onClick={() => apply(f.id, { state: 'rejected' }, `Rejected: ${value}`)}
                          >
                            <Ban className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}

          {/* Red flags card */}
          <Card className="p-5 ring-2 ring-rose-200">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-rose-500">Red Flags</h3>
            <div className="mt-3 rounded-xl bg-rose-50 p-3 ring-1 ring-rose-200">
              <div className="flex flex-wrap items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                <p className="flex-1 font-semibold text-rose-700">Exertional chest pain + breathlessness</p>
                <SourceTag source="AI Flag" />
              </div>
              <p className="mt-2 text-xs text-rose-400">
                Pattern surfaced for human triage review — not a diagnosis. Priority Triage status set on kiosk.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* B. Timeline */}
      <section>
        <SectionLabel icon={<CalendarClock className="h-4 w-4" />}>Section B</SectionLabel>
        <h2 className="mb-4 text-xl font-bold text-slate-800">Medical Timeline</h2>
        <Card className="p-6">
          <Timeline events={DEMO_TIMELINE} compact />
        </Card>
      </section>

      {/* C. Documents */}
      <section>
        <SectionLabel icon={<FileText className="h-4 w-4" />}>Section C</SectionLabel>
        <h2 className="mb-4 text-xl font-bold text-slate-800">Documents</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {DEMO_DOCS.map((d) => (
            <Card key={d.id} className="flex items-center gap-4 p-4">
              <DocThumb doc={d} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-700">{d.fileName}</p>
                <p className="text-xs text-slate-400">
                  {d.kind} · {d.sizeLabel}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast('info', `Opening ${d.fileName} (demo preview)`)}>
                    Open
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast('success', `Extraction verified for ${d.fileName}`)}>
                    Verify Extraction
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* D. AI Transparency */}
      <section>
        <SectionLabel icon={<Sparkles className="h-4 w-4" />}>Section D</SectionLabel>
        <h2 className="mb-1 text-xl font-bold text-slate-800">AI Transparency</h2>
        <p className="mb-4 text-sm text-slate-400">Physician verification required.</p>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <Badge tone="teal">Patient-reported</Badge>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              <li>Chest pain × 3 days</li>
              <li>Worse during walking</li>
              <li>Breathlessness reported</li>
              <li>Allergies: Not Reported</li>
            </ul>
          </Card>
          <Card className="p-5">
            <Badge tone="blue">Document-extracted</Badge>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              <li>Hypertension (94%)</li>
              <li>Diabetes (90%)</li>
              <li>Amlodipine 5 mg (97%)</li>
              <li>Metformin 500 mg (95%)</li>
              <li>HbA1c 8.1% (92%)</li>
              <li>Hemoglobin 10.2 g/dL (55% — needs verification)</li>
            </ul>
          </Card>
          <Card className="p-5">
            <Badge tone="amber">AI-generated flags</Badge>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              <li>Exertional chest pain + breathlessness → Priority Triage</li>
              <li>Low-confidence OCR on Hemoglobin value</li>
            </ul>
            <p className="mt-3 border-t border-slate-100 pt-2 text-xs font-semibold text-slate-400">
              Physician verification required.
            </p>
          </Card>
        </div>
      </section>

      {/* E. Doctor actions */}
      <section className="pb-6">
        <SectionLabel icon={<CheckCheck className="h-4 w-4" />}>Section E</SectionLabel>
        <h2 className="mb-4 text-xl font-bold text-slate-800">Doctor Actions</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Button size="lg" variant="success" onClick={() => setConfirmAccept(true)} disabled={accepted}>
            <CheckCheck className="h-5 w-5" /> Accept Summary
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.scrollTo({ top: 420, behavior: 'smooth' })}>
            <Pencil className="h-5 w-5" /> Edit Summary
          </Button>
          <Button size="lg" variant="outline" onClick={() => { setReinterview(true); toast('info', 'Re-interview requested — patient will answer follow-up questions at kiosk.'); }}>
            <RefreshCcw className="h-5 w-5" /> Request Re-interview
          </Button>
          <Button size="lg" variant="danger" onClick={() => toast('warn', 'Patient sent to triage nurse.')}>
            <Send className="h-5 w-5" /> Send to Triage
          </Button>
        </div>

        {accepted && (
          <Card className="mt-4 flex items-center gap-3 border-l-4 border-emerald-500 p-4 animate-fade-up">
            <BadgeCheck className="h-6 w-6 text-emerald-600" />
            <p className="font-bold text-emerald-700">Summary verified by physician.</p>
          </Card>
        )}
      </section>

      {/* Edit modal */}
      <Modal
        open={!!editing}
        title="Edit clinical field"
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit}>Save</Button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-500">Value</span>
          <textarea
            className="w-full rounded-xl border-2 border-slate-200 p-3 text-base focus:border-teal-500 focus:outline-none"
            rows={3}
            value={editing?.value ?? ''}
            onChange={(e) => setEditing((x) => (x ? { ...x, value: e.target.value } : x))}
          />
        </label>
      </Modal>

      {/* Accept confirm modal */}
      <Modal
        open={confirmAccept}
        title="Accept pre-consultation summary?"
        onClose={() => setConfirmAccept(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmAccept(false)}>Cancel</Button>
            <Button
              variant="success"
              onClick={() => {
                setAccepted(true);
                setConfirmAccept(false);
                toast('success', 'Summary verified by physician.');
              }}
            >
              <CheckCheck className="h-5 w-5" /> Accept
            </Button>
          </>
        }
      >
        <p>
          You confirm that the AI-prepared summary has been reviewed. You can still edit or reject individual
          items afterwards.
        </p>
      </Modal>

      {/* Re-interview modal */}
      <Modal open={reinterview} title="Re-interview requested" onClose={() => setReinterview(false)}
        footer={<Button variant="primary" onClick={() => setReinterview(false)}>Done</Button>}>
        <p>
          The kiosk will ask Rajesh the follow-up questions you mark. Suggested topics: duration of
          breathlessness, sweating episodes, family history of cardiac disease.
        </p>
      </Modal>
    </div>
  );
}
