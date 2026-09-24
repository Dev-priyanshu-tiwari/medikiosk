import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  FilePlus2,
  FileText,
  FlaskConical,
  Pill,
  ScanLine,
  UploadCloud,
} from 'lucide-react';
import { Button, Card, Badge, Confidence, DocThumb, SectionLabel } from '../../ui';
import { DEMO_DOCS } from '../../demo';
import type { UploadedDoc } from '../../types';
import { useToasts } from '../../toast';

type Stage = 'upload' | 'processing' | 'extracted';

const KIND_ICON = {
  Prescription: <Pill className="h-6 w-6" />,
  'Lab Report': <FlaskConical className="h-6 w-6" />,
  'Discharge Summary': <FileText className="h-6 w-6" />,
  'Other Report': <FileText className="h-6 w-6" />,
};

const STAGES = ['Reading document…', 'Extracting clinical information…', 'Building your medical timeline…'];

export function Documents() {
  const navigate = useNavigate();
  const { toast } = useToasts();
  const [docs, setDocs] = useState<UploadedDoc[]>(DEMO_DOCS.map((d) => ({ ...d })));
  const [stage, setStage] = useState<Stage>('upload');
  const [stageIdx, setStageIdx] = useState(0);
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Upload simulation: any file added becomes a generic uploaded doc */
  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const newDocs: UploadedDoc[] = Array.from(files).map((f, i) => ({
        id: `up-${Date.now()}-${i}`,
        fileName: f.name,
        kind: 'Other Report',
        sizeLabel: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
        status: 'done' as const,
        extractionProgress: 100,
      }));
      setDocs((d) => [...d, ...newDocs]);
      toast('success', `${newDocs.length} file(s) added to the session.`);
    },
    [toast]
  );

  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  const runExtraction = () => {
    setStage('processing');
    setStageIdx(0);
    // animate through the 3 stages
    const t1 = window.setTimeout(() => setStageIdx(1), 1300);
    const t2 = window.setTimeout(() => setStageIdx(2), 2600);
    const t3 = window.setTimeout(() => {
      setStage('extracted');
      toast('success', 'Information extracted from your documents.');
    }, 3900);
    timers.current.push(t1, t2, t3);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Bring your previous medical records together</h1>
          <p className="mt-1 text-slate-500">
            Prescriptions, lab reports, discharge summaries — MediKiosk reads them for the doctor.
          </p>
        </div>
      </div>

      {/* Upload cards */}
      {stage === 'upload' && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(['Prescription', 'Lab Report', 'Discharge Summary', 'Other Report'] as const).map((k) => (
              <button
                key={k}
                onClick={() => inputRef.current?.click()}
                className="rounded-2xl bg-white p-6 text-left ring-2 ring-slate-200 transition-all hover:ring-teal-400 active:scale-[0.98]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  {KIND_ICON[k]}
                </div>
                <p className="font-bold text-slate-800">{k}</p>
                <p className="mt-0.5 text-xs text-slate-400">Tap to upload</p>
              </button>
            ))}
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={clsx(
              'mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors',
              dragOver ? 'border-teal-500 bg-teal-50/60' : 'border-slate-300 bg-white/60 hover:border-teal-400'
            )}
          >
            <UploadCloud className="mx-auto h-10 w-10 text-teal-500" />
            <p className="mt-3 text-lg font-bold text-slate-700">Drag & drop files here, or tap to browse</p>
            <p className="text-sm text-slate-400">JPG, PNG or PDF · demo session</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          {/* Files list */}
          {docs.length > 0 && (
            <Card className="mt-6 p-5">
              <SectionLabel icon={<FilePlus2 className="h-4 w-4" />}>In this session</SectionLabel>
              <div className="mt-4 flex flex-wrap gap-4">
                {docs.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <DocThumb doc={d} />
                    <div>
                      <p className="text-sm font-bold text-slate-700">{d.fileName}</p>
                      <p className="text-xs text-slate-400">{d.sizeLabel}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end">
                <Button size="lg" variant="teal" onClick={runExtraction}>
                  <ScanLine className="h-5 w-5" /> Read My Documents
                </Button>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Processing animation */}
      {stage === 'processing' && (
        <Card className="mt-8 p-8">
          <div className="flex flex-col items-center">
            <div className="relative flex h-40 w-32 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
              <FileText className="h-16 w-16 text-slate-300" />
              <div className="absolute left-0 right-0 h-1 bg-teal-500/80 animate-scanline" />
            </div>
            <div className="mt-6 w-full max-w-md space-y-3">
              {STAGES.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  {i < stageIdx ? (
                    <BadgeCheck className="h-5 w-5 text-emerald-500" />
                  ) : i === stageIdx ? (
                    <span className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
                  ) : (
                    <span className="h-5 w-5 rounded-full border-2 border-slate-200" />
                  )}
                  <span
                    className={clsx(
                      'text-base font-semibold',
                      i <= stageIdx ? 'text-slate-700' : 'text-slate-300'
                    )}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Extracted view */}
      {stage === 'extracted' && (
        <div className="mt-8 space-y-5 animate-fade-up">
          {docs
            .filter((d) => d.extracted)
            .map((doc) => (
              <Card key={doc.id} className="p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <DocThumb doc={doc} />
                  <div>
                    <p className="font-bold text-slate-800">{doc.kind}</p>
                    <p className="text-sm text-slate-400">{doc.fileName}</p>
                  </div>
                  <Badge tone="blue" className="ml-auto">Source: {doc.fileName}</Badge>
                </div>

                {/* Extracted items */}
                <div className="mt-4 space-y-3">
                  {doc.extracted?.medications?.map((m) => (
                    <ExtractRow
                      key={m.name}
                      label={`${m.name} ${m.dose}`}
                      kind="Medicine"
                      confidence={m.confidence}
                      onVerify={() => {
                        setVerified((v) => ({ ...v, [m.name]: true }));
                        toast('success', `Verified: ${m.name} ${m.dose}`);
                      }}
                      isVerified={!!verified[m.name]}
                    />
                  ))}
                  {doc.extracted?.investigations?.map((iv) => (
                    <ExtractRow
                      key={iv.name}
                      label={`${iv.name}: ${iv.value}`}
                      kind="Lab value"
                      confidence={iv.confidence}
                      needsVerification={iv.needsVerification}
                      onVerify={() => {
                        setVerified((v) => ({ ...v, [iv.name]: true }));
                        toast('success', `Verified: ${iv.name}`);
                      }}
                      isVerified={!!verified[iv.name]}
                    />
                  ))}
                  {doc.extracted?.conditions?.map((c) => (
                    <ExtractRow
                      key={c.name}
                      label={c.name}
                      kind="Condition"
                      confidence={c.confidence}
                      onVerify={() => {
                        setVerified((v) => ({ ...v, [c.name]: true }));
                        toast('success', `Verified: ${c.name}`);
                      }}
                      isVerified={!!verified[c.name]}
                    />
                  ))}
                </div>
              </Card>
            ))}

          {/* Footer */}
          <div className="flex items-center justify-between pb-4">
            <Button variant="ghost" size="sm" onClick={() => setStage('upload')}>
              <ArrowLeft className="h-4 w-4" /> Back to upload
            </Button>
            <Button size="lg" variant="teal" onClick={() => navigate('/kiosk/timeline')}>
              See Medical Timeline <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ExtractRow({
  label,
  kind,
  confidence,
  needsVerification,
  onVerify,
  isVerified,
}: {
  label: string;
  kind: string;
  confidence: number;
  needsVerification?: boolean;
  onVerify: () => void;
  isVerified: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex flex-wrap items-center gap-3 rounded-xl p-4 ring-1',
        isVerified ? 'bg-emerald-50/60 ring-emerald-200' : 'bg-slate-50 ring-slate-200'
      )}
    >
      <div className="min-w-[180px] flex-1">
        <p className="text-base font-bold text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{kind} · Source document attached</p>
      </div>
      <Confidence score={confidence} />
      {needsVerification && !isVerified && (
        <Badge tone="amber">Needs physician verification</Badge>
      )}
      {isVerified ? (
        <Badge tone="emerald">
          <BadgeCheck className="h-3.5 w-3.5" /> Verified
        </Badge>
      ) : (
        <Button size="sm" variant="outline" onClick={onVerify}>
          <BadgeCheck className="h-4 w-4" /> Verify
        </Button>
      )}
    </div>
  );
}
