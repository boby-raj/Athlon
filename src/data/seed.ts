import { subDays, format, addDays } from 'date-fns';
import type { Athlete, TrainingSession, Fixture } from '../types';

export const DEMO_ATHLETE: Athlete = {
  id: 'ATH-001',
  name: 'Alex Carter',
  position: 'Professional Midfielder',
  status: 'TRAINING READY',
};

// Generate realistic 28+ days of data
const today = new Date();
export const DEMO_SESSIONS: TrainingSession[] = [];

// Base load around 500
// We'll create some variation, occasionally lower for recovery, higher for development
for (let i = 35; i >= 0; i--) {
  const date = subDays(today, i);
  const isRest = i % 7 === 1; // Rest day every week
  const isMatch = i % 7 === 4; // Match day
  
  let workload = 450 + Math.random() * 200;
  let recovery = 70 + Math.random() * 20;
  let rpe = 5 + Math.random() * 3;
  let distance = 8 + Math.random() * 4;

  if (isRest) {
    workload = 100 + Math.random() * 50;
    recovery = 85 + Math.random() * 10;
    rpe = 2 + Math.random() * 2;
    distance = 2 + Math.random() * 2;
  } else if (isMatch) {
    workload = 800 + Math.random() * 200;
    recovery = 50 + Math.random() * 15;
    rpe = 8 + Math.random() * 2;
    distance = 11 + Math.random() * 3;
  }

  DEMO_SESSIONS.push({
    id: `sess-${i}`,
    date: format(date, 'yyyy-MM-dd'),
    workload: Math.round(workload),
    distance: Number(distance.toFixed(1)),
    rpe: Math.round(rpe),
    recovery: Math.round(recovery),
    sleep: Number((7 + Math.random() * 2).toFixed(1))
  });
}

export const DEMO_FIXTURES: Fixture[] = [
  {
    id: 'fix-1',
    date: format(addDays(today, 3), 'yyyy-MM-dd'),
    opponent: 'Metro United',
    importance: 'Medium'
  },
  {
    id: 'fix-2',
    date: format(addDays(today, 10), 'yyyy-MM-dd'),
    opponent: 'Sporting City',
    importance: 'High'
  }
];
