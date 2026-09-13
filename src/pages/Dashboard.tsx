import React from 'react';
import { useAthlon } from '../context/AthlonContext';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { ACWRGauge } from '../components/ui/ACWRGauge';
import { RecoveryRing } from '../components/ui/RecoveryRing';
import { RiskIndicator } from '../components/ui/RiskIndicator';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, Info, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
  const { 
    sessions, 
    fixtures, 
    acwr, 
    currentRisk, 
    latestRecovery,
    acuteLoad,
    chronicLoad,
    notifications
  } = useAthlon();

  // Prepare chart data (last 14 days)
  const sortedSessions = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const chartData = sortedSessions.slice(-14).map(s => ({
    date: format(parseISO(s.date), 'MMM d'),
    workload: s.workload,
    recovery: s.recovery || 0
  }));

  const upcomingFixture = [...fixtures].sort((a, b) => a.date.localeCompare(b.date)).find(f => f.date >= new Date().toISOString().split('T')[0]);

  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Section - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ACWR Card */}
        <Card className="col-span-1 md:col-span-1 flex flex-col items-center justify-center p-8">
          <CardTitle className="mb-6 w-full text-center">Acute:Chronic Ratio</CardTitle>
          <ACWRGauge value={acwr} size={200} />
          <div className="mt-8 text-center">
            <RiskIndicator risk={currentRisk} />
          </div>
        </Card>

        {/* Recovery & Context */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="flex flex-col items-center justify-center p-8">
            <CardTitle className="mb-6 w-full text-center">Latest Recovery</CardTitle>
            <RecoveryRing value={latestRecovery} size={140} />
            <p className="mt-6 text-sm text-white/50 text-center">
              Based on sleep & RPE
            </p>
          </Card>
          
          <Card className="flex flex-col justify-between p-6">
            <div>
              <CardTitle>Next Fixture</CardTitle>
              {upcomingFixture ? (
                <div className="mt-4">
                  <p className="text-3xl font-bold text-white mb-1">{upcomingFixture.opponent}</p>
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span>{format(parseISO(upcomingFixture.date), 'MMM d, yyyy')}</span>
                    <span className="text-white/30">•</span>
                    <span className={upcomingFixture.importance === 'High' ? 'text-red-400' : 'text-white/70'}>
                      {upcomingFixture.importance} Importance
                    </span>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-white/50">No upcoming fixtures.</p>
              )}
            </div>

            <div className="mt-8">
              <CardTitle>Load Summary</CardTitle>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/50 uppercase">7-Day Avg</p>
                  <p className="text-xl font-numeric text-white">{Math.round(acuteLoad)} <span className="text-xs text-white/50">AU</span></p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase">28-Day Avg</p>
                  <p className="text-xl font-numeric text-white">{Math.round(chronicLoad)} <span className="text-xs text-white/50">AU</span></p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Middle Section - Chart & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Workload Trend (14 Days)</CardTitle>
          </CardHeader>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWorkload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand-cyan)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-brand-cyan)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ color: 'var(--color-brand-cyan)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="workload" 
                  stroke="var(--color-brand-cyan)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorWorkload)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>What Needs Attention</CardTitle>
          </CardHeader>
          <div className="flex-1 overflow-y-auto space-y-3">
            {currentRisk !== 'Low Risk' && (
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Risk Elevated</h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Current risk classification is {currentRisk}. The deterministic engine recommends adjusting load for upcoming sessions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {recentNotifications.length > 0 ? (
              recentNotifications.map(n => (
                <div key={n.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[var(--color-brand-cyan)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">{n.title}</h4>
                      <p className="text-xs text-white/60 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm">
                <p>System operating normally.</p>
                <p>No new alerts.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
