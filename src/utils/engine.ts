import { subDays, differenceInDays, parseISO, isSameDay, addDays } from 'date-fns';
import type { TrainingSession, RiskLevel, Fixture, PlanDay } from '../types';

export function calculateAverages(sessions: TrainingSession[], date: Date) {
  let acuteTotal = 0;
  let chronicTotal = 0;
  let acuteDaysWithData = 0;
  let chronicDaysWithData = 0;

  for (let i = 0; i < 28; i++) {
    const targetDate = subDays(date, i);
    const session = sessions.find(s => isSameDay(parseISO(s.date), targetDate));
    const load = session?.workload || 0;

    chronicTotal += load;
    if (session) chronicDaysWithData++;

    if (i < 7) {
      acuteTotal += load;
      if (session) acuteDaysWithData++;
    }
  }

  // The prompt says "rolling average workload", so we divide by the total days (7 and 28)
  // or by days with data? Usually in sports science, it's divided by total days to reflect true average load over that period.
  const acuteLoad = acuteTotal / 7;
  const chronicLoad = chronicTotal / 28;
  const acwr = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;

  return { acuteLoad, chronicLoad, acwr };
}

export function calculateRisk(acwr: number, latestRecovery: number): RiskLevel {
  if (acwr > 1.5 || latestRecovery < 40) return 'High Risk';
  if ((acwr >= 1.3 && acwr <= 1.5) || (latestRecovery >= 40 && latestRecovery < 60)) return 'Moderate Risk';
  if (acwr >= 0.8 && acwr < 1.3 && latestRecovery >= 60) return 'Low Risk';
  return 'Under-training Risk';
}

export function generatePlan(
  sessions: TrainingSession[],
  fixtures: Fixture[],
  startDate: Date
): PlanDay[] {
  const plan: PlanDay[] = [];
  
  // Calculate current chronic load and recovery just before starting plan
  const { chronicLoad } = calculateAverages(sessions, subDays(startDate, 1));
  
  // Find the latest recovery score before start date
  const pastSessions = sessions.filter(s => parseISO(s.date) < startDate).sort((a, b) => b.date.localeCompare(a.date));
  const latestRecovery = pastSessions.find(s => s.recovery !== undefined)?.recovery ?? 100;
  
  // Need ACWR at start date
  const { acwr } = calculateAverages(sessions, subDays(startDate, 1));

  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(startDate, i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Check fixtures
    const matchToday = fixtures.find(f => isSameDay(parseISO(f.date), currentDate));
    const matchTomorrow = fixtures.find(f => isSameDay(parseISO(f.date), addDays(currentDate, 1)));
    
    // High-importance match within 3 days (tomorrow, day after tomorrow, or day after that)
    const highMatchSoon = fixtures.find(f => {
      const diff = differenceInDays(parseISO(f.date), currentDate);
      return diff > 0 && diff <= 3 && f.importance === 'High';
    });

    let targetLoad = 0;
    let focus = '';
    let rationale = '';
    let sessionType = 'Training';

    // Rule 1: Match day
    if (matchToday) {
      sessionType = 'Match';
      targetLoad = 0;
      focus = 'Performance';
      rationale = 'Match day';
    } 
    // Rule 2: Day before match
    else if (matchTomorrow) {
      targetLoad = chronicLoad * 0.4;
      focus = 'Activation & Tactical Prep';
      rationale = 'Day before match';
    }
    // Rule 3: Recovery < 50% OR ACWR > 1.5
    else if (latestRecovery < 50 || acwr > 1.5) {
      targetLoad = chronicLoad * 0.3;
      focus = 'Active Recovery & Mobility';
      rationale = 'Recovery < 50% OR ACWR > 1.5';
    }
    // Rule 4: High-importance match within 3 days
    else if (highMatchSoon) {
      targetLoad = chronicLoad * 0.7;
      focus = 'Sub-maximal Sharpening';
      rationale = 'High-importance match within 3 days';
    }
    // Rule 5: Otherwise
    else {
      targetLoad = chronicLoad * 1.1;
      focus = 'Aerobic Power / Strength';
      rationale = 'Standard development load (110% chronic)';
    }

    plan.push({
      date: dateStr,
      dayLabel: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
      sessionType,
      targetLoad: Math.round(targetLoad),
      trainingFocus: focus,
      rationale
    });
  }

  return plan;
}
