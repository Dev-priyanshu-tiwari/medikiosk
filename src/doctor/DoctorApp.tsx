import React from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  CalendarClock,
  FileText,
  LayoutDashboard,
  ListOrdered,
  Settings,
  Users,
} from 'lucide-react';
import { Overview } from './Overview';
import { Patients } from './Patients';
import { Queue } from './Queue';
import { TimelinePage } from './TimelinePage';
import { DocumentsPage } from './DocumentsPage';
import { SettingsPage } from './SettingsPage';

const NAV = [
  { to: '/doctor', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/doctor/patients', label: 'Patients', icon: Users },
  { to: '/doctor/queue', label: 'Current Queue', icon: ListOrdered },
  { to: '/doctor/timeline', label: 'Medical Timeline', icon: CalendarClock },
  { to: '/doctor/documents', label: 'Documents', icon: FileText },
  { to: '/doctor/settings', label: 'Settings', icon: Settings },
];

export function DoctorApp() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <div>
            <p className="font-extrabold tracking-tight text-slate-800">MediKiosk</p>
            <p className="text-xs font-semibold text-teal-700">Doctor Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => {
            const active = n.end ? location.pathname === n.to : location.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                  active ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                )}
              >
                <Icon className="h-5 w-5" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <Link
            to="/kiosk"
            className="block rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-bold text-slate-600 transition hover:bg-slate-200"
          >
            Open Patient Kiosk
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 px-8 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-800">
                {NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))?.label ??
                  'Dashboard'}
              </h1>
              <p className="text-xs text-slate-400">AI prepares the information. The doctor makes the decision.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 md:inline">
                OPD · Room 4 · Dr. Mehta
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                DM
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="patients" element={<Patients />} />
            <Route path="queue" element={<Queue />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/doctor" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
