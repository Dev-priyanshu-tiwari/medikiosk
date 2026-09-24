import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { KioskProvider } from './KioskContext';
import { KioskLayout } from './KioskLayout';
import { Welcome } from './screens/Welcome';
import { Identify } from './screens/Identify';
import { Consent } from './screens/Consent';
import { History } from './screens/History';
import { RedFlag } from './screens/RedFlag';
import { Documents } from './screens/Documents';
import { KioskTimeline } from './screens/Timeline';
import { Summary } from './screens/Summary';
import { Submitted } from './screens/Submitted';

export function KioskApp() {
  return (
    <KioskProvider>
      <KioskLayout>
        <Routes>
          <Route index element={<Welcome />} />
          <Route path="identify" element={<Identify />} />
          <Route path="consent" element={<Consent />} />
          <Route path="history" element={<History />} />
          <Route path="redflag" element={<RedFlag />} />
          <Route path="documents" element={<Documents />} />
          <Route path="timeline" element={<KioskTimeline />} />
          <Route path="summary" element={<Summary />} />
          <Route path="submitted" element={<Submitted />} />
          <Route path="*" element={<Navigate to="/kiosk" replace />} />
        </Routes>
      </KioskLayout>
    </KioskProvider>
  );
}
