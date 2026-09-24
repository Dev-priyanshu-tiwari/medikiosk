import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider, ToastStack } from './toast';
import { KioskApp } from './kiosk/KioskApp';
import { DoctorApp } from './doctor/DoctorApp';

export default function App() {
  return (
    <ToastProvider>
      <ToastStack />
      <Routes>
        <Route path="/" element={<Navigate to="/kiosk" replace />} />
        <Route path="/kiosk/*" element={<KioskApp />} />
        <Route path="/doctor/*" element={<DoctorApp />} />
        <Route path="*" element={<Navigate to="/kiosk" replace />} />
      </Routes>
    </ToastProvider>
  );
}
