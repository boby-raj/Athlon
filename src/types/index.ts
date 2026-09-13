export type RiskLevel = 'High Risk' | 'Moderate Risk' | 'Low Risk' | 'Under-training Risk';
export type FixtureImportance = 'Low' | 'Medium' | 'High';

export interface Athlete {
  id: string;
  name: string;
  position: string;
  status: string;
  avatarUrl?: string;
}

export interface TrainingSession {
  id: string;
  date: string; // YYYY-MM-DD
  workload: number; // AU (Arbitrary Units)
  distance?: number; // km
  rpe?: number; // 1-10
  recovery?: number; // 0-100%
  sleep?: number; // hours
}

export interface Fixture {
  id: string;
  date: string; // YYYY-MM-DD
  opponent: string;
  importance: FixtureImportance;
}

export interface PlanDay {
  date: string;
  dayLabel: string;
  sessionType: string;
  targetLoad: number;
  trainingFocus: string;
  rationale: string;
  isOverridden?: boolean;
  originalValues?: Partial<PlanDay>;
}

export interface Settings {
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  notifications: boolean;
}

export interface NotificationMsg {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: string;
  read: boolean;
}
