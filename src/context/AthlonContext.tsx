import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DEMO_ATHLETE, DEMO_SESSIONS, DEMO_FIXTURES } from '../data/seed';
import { generatePlan, calculateAverages, calculateRisk } from '../utils/engine';
import type { Athlete, TrainingSession, Fixture, PlanDay, Settings, NotificationMsg, RiskLevel } from '../types';

interface AthlonContextType {
  athlete: Athlete;
  sessions: TrainingSession[];
  fixtures: Fixture[];
  plan: PlanDay[];
  settings: Settings;
  notifications: NotificationMsg[];
  
  // Computed metrics based on today
  acuteLoad: number;
  chronicLoad: number;
  acwr: number;
  currentRisk: RiskLevel;
  latestRecovery: number;

  // Actions
  addSession: (session: Omit<TrainingSession, 'id'>) => void;
  importSessions: (sessions: TrainingSession[]) => void;
  addFixture: (fixture: Omit<Fixture, 'id'>) => void;
  removeFixture: (id: string) => void;
  updatePlanDay: (date: string, updates: Partial<PlanDay>) => void;
  regeneratePlan: () => void;
  resetPlan: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
  addNotification: (msg: Omit<NotificationMsg, 'id' | 'date' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearDemoData: () => void;
}

const AthlonContext = createContext<AthlonContextType | undefined>(undefined);

export function AthlonProvider({ children }: { children: ReactNode }) {
  const [athlete, setAthlete] = useState<Athlete>(DEMO_ATHLETE);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [plan, setPlan] = useState<PlanDay[]>([]);
  const [settings, setSettings] = useState<Settings>({ theme: 'dark', reducedMotion: false, notifications: true });
  const [notifications, setNotifications] = useState<NotificationMsg[]>([]);

  // Initialize from localStorage or seed data
  useEffect(() => {
    const storedSessions = localStorage.getItem('athlon_sessions');
    const storedFixtures = localStorage.getItem('athlon_fixtures');
    const storedPlan = localStorage.getItem('athlon_plan');
    const storedSettings = localStorage.getItem('athlon_settings');

    const initialSessions = storedSessions ? JSON.parse(storedSessions) : DEMO_SESSIONS;
    const initialFixtures = storedFixtures ? JSON.parse(storedFixtures) : DEMO_FIXTURES;
    
    setSessions(initialSessions);
    setFixtures(initialFixtures);
    
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    } else {
      const newPlan = generatePlan(initialSessions, initialFixtures, new Date());
      setPlan(newPlan);
      localStorage.setItem('athlon_plan', JSON.stringify(newPlan));
    }
    
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Persist when data changes
  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('athlon_sessions', JSON.stringify(sessions));
    if (fixtures.length > 0) localStorage.setItem('athlon_fixtures', JSON.stringify(fixtures));
    if (plan.length > 0) localStorage.setItem('athlon_plan', JSON.stringify(plan));
    localStorage.setItem('athlon_settings', JSON.stringify(settings));
  }, [sessions, fixtures, plan, settings]);

  // Apply theme
  useEffect(() => {
    if (settings.theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [settings.theme]);

  // Computed metrics
  const today = new Date();
  const { acuteLoad, chronicLoad, acwr } = calculateAverages(sessions, today);
  const pastSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  const latestRecovery = pastSessions.find(s => s.recovery !== undefined)?.recovery ?? 100;
  const currentRisk = calculateRisk(acwr, latestRecovery);

  // Actions
  const addSession = (sessionData: Omit<TrainingSession, 'id'>) => {
    const newSession = { ...sessionData, id: `sess-${Date.now()}` };
    const newSessions = [...sessions, newSession];
    setSessions(newSessions);
    addNotification({ title: 'Session Added', message: `Training log for ${sessionData.date} saved.`, type: 'success' });
    regeneratePlanForSessions(newSessions, fixtures);
  };

  const importSessions = (imported: TrainingSession[]) => {
    setSessions(imported);
    addNotification({ title: 'Import Complete', message: `Successfully imported ${imported.length} sessions.`, type: 'success' });
    regeneratePlanForSessions(imported, fixtures);
  };

  const addFixture = (fixtureData: Omit<Fixture, 'id'>) => {
    const newFixture = { ...fixtureData, id: `fix-${Date.now()}` };
    const newFixtures = [...fixtures, newFixture].sort((a, b) => a.date.localeCompare(b.date));
    setFixtures(newFixtures);
    regeneratePlanForSessions(sessions, newFixtures);
  };

  const removeFixture = (id: string) => {
    const newFixtures = fixtures.filter(f => f.id !== id);
    setFixtures(newFixtures);
    regeneratePlanForSessions(sessions, newFixtures);
  };

  const updatePlanDay = (date: string, updates: Partial<PlanDay>) => {
    setPlan(currentPlan => currentPlan.map(day => {
      if (day.date === date) {
        return {
          ...day,
          ...updates,
          isOverridden: true,
          originalValues: day.originalValues || {
            sessionType: day.sessionType,
            targetLoad: day.targetLoad,
            trainingFocus: day.trainingFocus,
            rationale: day.rationale
          }
        };
      }
      return day;
    }));
  };

  const regeneratePlanForSessions = (s: TrainingSession[], f: Fixture[]) => {
    const newPlan = generatePlan(s, f, new Date());
    setPlan(newPlan);
  };

  const regeneratePlan = () => {
    regeneratePlanForSessions(sessions, fixtures);
    addNotification({ title: 'Plan Regenerated', message: '7-day plan rebuilt using deterministic engine.', type: 'info' });
  };

  const resetPlan = () => {
    regeneratePlan();
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(s => ({ ...s, ...updates }));
  };

  const addNotification = (msg: Omit<NotificationMsg, 'id' | 'date' | 'read'>) => {
    const newMsg: NotificationMsg = {
      ...msg,
      id: `notif-${Date.now()}`,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newMsg, ...prev].slice(0, 10)); // Keep last 10
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearDemoData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AthlonContext.Provider value={{
      athlete, sessions, fixtures, plan, settings, notifications,
      acuteLoad, chronicLoad, acwr, currentRisk, latestRecovery,
      addSession, importSessions, addFixture, removeFixture,
      updatePlanDay, regeneratePlan, resetPlan, updateSettings,
      addNotification, markNotificationRead, clearDemoData
    }}>
      {children}
    </AthlonContext.Provider>
  );
}

export function useAthlon() {
  const context = useContext(AthlonContext);
  if (context === undefined) {
    throw new Error('useAthlon must be used within an AthlonProvider');
  }
  return context;
}
