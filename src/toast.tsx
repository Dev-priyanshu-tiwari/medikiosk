import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { Toast } from './types';

interface ToastCtx {
  toasts: Toast[];
  toast: (kind: Toast['kind'], message: string) => void;
  dismiss: (id: number) => void;
}

const Ctx = createContext<ToastCtx>({ toasts: [], toast: () => {}, dismiss: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const toast = useCallback((kind: Toast['kind'], message: string) => {
    const id = ++seq.current;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useToasts() {
  return useContext(Ctx);
}

const ICONS: Record<Toast['kind'], React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  info: <Info className="h-5 w-5 text-primary-600" />,
  warn: <AlertTriangle className="h-5 w-5 text-amber-600" />,
  error: <XCircle className="h-5 w-5 text-rose-600" />,
};

export function ToastStack() {
  const { toasts, dismiss } = useToasts();
  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[100] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 rounded-xl bg-white p-4 shadow-card-lg ring-1 ring-slate-200 animate-fade-up"
        >
          {ICONS[t.kind]}
          <p className="flex-1 text-sm font-medium text-slate-700">{t.message}</p>
          <button
            onClick={() => dismiss(t.id)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
