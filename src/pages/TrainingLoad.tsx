import React from 'react';
import { useAthlon } from '../context/AthlonContext';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line } from 'recharts';
import { format, parseISO } from 'date-fns';

export function TrainingLoad() {
  const { sessions, acuteLoad, chronicLoad, acwr } = useAthlon();
  
  const sortedSessions = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const chartData = sortedSessions.slice(-28).map(s => ({
    date: format(parseISO(s.date), 'MMM d'),
    workload: s.workload,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Training Load Analytics</h1>
        <p className="text-sm text-white/50 mt-1">Detailed workload distribution and trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardTitle className="mb-2">Acute Load (7-Day Avg)</CardTitle>
          <p className="text-3xl font-numeric text-white">{Math.round(acuteLoad)} <span className="text-base text-white/50">AU</span></p>
        </Card>
        <Card>
          <CardTitle className="mb-2">Chronic Load (28-Day Avg)</CardTitle>
          <p className="text-3xl font-numeric text-white">{Math.round(chronicLoad)} <span className="text-base text-white/50">AU</span></p>
        </Card>
        <Card>
          <CardTitle className="mb-2">A:C Workload Ratio</CardTitle>
          <p className="text-3xl font-numeric text-[var(--color-brand-cyan)]">{acwr.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle>Workload History (28 Days)</CardTitle>
        </CardHeader>
        <div className="flex-1 w-full min-h-0 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121212', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="workload" fill="var(--color-brand-cyan)" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="workload" stroke="var(--color-brand-cyan)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
