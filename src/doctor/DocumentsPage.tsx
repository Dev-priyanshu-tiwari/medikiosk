import React from 'react';
import { FolderOpen, ShieldCheck } from 'lucide-react';
import { Badge, Button, Card, DocThumb, PageTitle } from '../ui';
import { DEMO_DOCS } from '../demo';
import { useToasts } from '../toast';

export function DocumentsPage() {
  const { toast } = useToasts();
  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Documents — Rajesh Kumar" sub="3 documents collected at kiosk · extraction verified per document" />
      <div className="space-y-4">
        {DEMO_DOCS.map((d) => (
          <Card key={d.id} className="p-5">
            <div className="flex flex-wrap items-center gap-4">
              <DocThumb doc={d} />
              <div className="min-w-[200px] flex-1">
                <p className="font-bold text-slate-800">{d.fileName}</p>
                <p className="text-sm text-slate-400">
                  {d.kind} · {d.sizeLabel} · Uploaded 09:38
                </p>
                {/* extracted chips */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {d.extracted?.medications?.map((m) => (
                    <Badge key={m.name} tone="blue">
                      {m.name} {m.dose} · {Math.round(m.confidence * 100)}%
                    </Badge>
                  ))}
                  {d.extracted?.investigations?.map((iv) => (
                    <Badge key={iv.name} tone={iv.needsVerification ? 'amber' : 'blue'}>
                      {iv.name}: {iv.value} · {Math.round(iv.confidence * 100)}%
                    </Badge>
                  ))}
                  {d.extracted?.conditions?.map((c) => (
                    <Badge key={c.name} tone="blue">
                      {c.name} · {Math.round(c.confidence * 100)}%
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toast('info', `Opening ${d.fileName} (demo preview)`)}>
                  <FolderOpen className="h-4 w-4" /> Open
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast('success', `Extraction verified for ${d.fileName}`)}>
                  <ShieldCheck className="h-4 w-4" /> Verify Extraction
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
