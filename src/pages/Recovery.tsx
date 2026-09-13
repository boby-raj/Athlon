import React from 'react';
import { useAthlon } from '../context/AthlonContext';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { RecoveryRing } from '../components/ui/RecoveryRing';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export function Recovery() {
  const { sessions, latestRecovery } = useAthlon();

  const sortedSessions = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const chartData = sortedSessions.filter(s => s.recovery !== undefined).slice(-14).map(s => ({
    date: format(parseISO(s.date), 'MMM d'),
    recovery: s.recovery,
    sleep: s.sleep,
    rpe: s.rpe
  }));

  const latestSession = sortedSessions[sortedSessions.length - 1];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Recovery & Readiness</h1>
        <p className="text-sm text-white/50 mt-1">Biological readiness indicators for workload management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 flex flex-col items-center justify-center p-8">
          <CardTitle className="mb-6">Current Readiness</CardTitle>
          <RecoveryRing value={latestRecovery} size={180} />
          <p className="text-xs text-white/50 mt-6 max-w-[200px] text-center">
            {latestRecovery >= 60 ? 'Optimal state for performance loading.' : 
             latestRecovery >= 40 ? 'Caution advised. Monitor fatigue.' : 
             'High fatigue. Prioritize recovery.'}
          </p>
        </Card>

        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardTitle className="mb-2">Latest Sleep</CardTitle>
            <p className="text-3xl font-numeric text-white">
              {latestSession?.sleep ? latestSession.sleep.toFixed(1) : '--'} <span className="text-base text-white/50">hrs</span>
            </p>
          </Card>
          <Card>
            <CardTitle className="mb-2">Latest RPE</CardTitle>
            <p className="text-3xl font-numeric text-white">
              {latestSession?.rpe ? latestSession.rpe : '--'} <span className="text-base text-white/50">/ 10</span>
            </p>
          </Card>
          <Card className="sm:col-span-2 p-6 bg-[var(--color-brand-cyan)]/5 border-[var(--color-brand-cyan)]/20">
            <CardTitle className="text-[var(--color-brand-cyan)]">Engine Impact</CardTitle>
            <p className="text-sm text-white/70 mt-2 leading-relaxed">
              Recovery scores below 50% automatically trigger Active Recovery days in the deterministic planner, regardless of the target load phase, to prevent overtraining injuries.
            </p>
          </Card>
        </div>
      </div>

      <Card className="h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle>Recovery Trend (14 Days)</CardTitle>
        </CardHeader>
        <div className="flex-1 w-full min-h-0 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121212', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              />
              <Line type="monotone" dataKey="recovery" stroke="var(--color-brand-lime)" strokeWidth={3} dot={{ r: 4, fill: '#121212', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
