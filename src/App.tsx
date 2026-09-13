/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AthlonProvider } from './context/AthlonContext';

import { LandingLayout } from './layouts/LandingLayout';
import { AppLayout } from './layouts/AppLayout';

import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { TrainingLoad } from './pages/TrainingLoad';
import { Recovery } from './pages/Recovery';
import { Fixtures } from './pages/Fixtures';
import { Planner } from './pages/Planner';
import { History } from './pages/History';
import { AICoach } from './pages/AICoach';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AthlonProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<Landing />} />
          </Route>
          
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="load" element={<TrainingLoad />} />
            <Route path="recovery" element={<Recovery />} />
            <Route path="fixtures" element={<Fixtures />} />
            <Route path="planner" element={<Planner />} />
            <Route path="history" element={<History />} />
            <Route path="ai-coach" element={<AICoach />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AthlonProvider>
  );
}


