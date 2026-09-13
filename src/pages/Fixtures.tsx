import React, { useState } from 'react';
import { useAthlon } from '../context/AthlonContext';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { Calendar, Trash2, Plus, X } from 'lucide-react';
import type { FixtureImportance } from '../types';

export function Fixtures() {
  const { fixtures, addFixture, removeFixture } = useAthlon();
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState({
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    importance: 'Medium' as FixtureImportance
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.opponent) return;
    addFixture(draft);
    setIsAdding(false);
    setDraft({ date: new Date().toISOString().split('T')[0], opponent: '', importance: 'Medium' });
  };

  const sortedFixtures = [...fixtures].sort((a, b) => a.date.localeCompare(b.date));
  const upcomingFixtures = sortedFixtures.filter(f => f.date >= new Date().toISOString().split('T')[0]);
  const pastFixtures = sortedFixtures.filter(f => f.date < new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Fixtures Timeline</h1>
          <p className="text-sm text-white/50 mt-1">Manage matches and events to drive the deterministic planner.</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Fixture
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="mb-6 border-[var(--color-brand-cyan)]/30">
              <form onSubmit={handleAdd} className="p-2">
                <div className="flex justify-between items-center mb-6">
                  <CardTitle>Add New Fixture</CardTitle>
                  <button type="button" onClick={() => setIsAdding(false)} className="text-white/50 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Date</label>
                    <input 
                      type="date" required
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-brand-cyan)] outline-none"
                      value={draft.date} onChange={e => setDraft({...draft, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Opponent / Event</label>
                    <input 
                      type="text" required placeholder="e.g., Metro United"
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-brand-cyan)] outline-none"
                      value={draft.opponent} onChange={e => setDraft({...draft, opponent: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Importance</label>
                    <select 
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-brand-cyan)] outline-none"
                      value={draft.importance} onChange={e => setDraft({...draft, importance: e.target.value as FixtureImportance})}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Fixture</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Upcoming
          </h2>
          {upcomingFixtures.length > 0 ? (
            <div className="space-y-3">
              {upcomingFixtures.map(f => (
                <FixtureCard key={f.id} fixture={f} onRemove={() => removeFixture(f.id)} />
              ))}
            </div>
          ) : (
            <div className="p-8 border border-white/10 border-dashed rounded-xl flex flex-col items-center justify-center text-white/30">
              <Calendar className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No upcoming fixtures</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Past</h2>
          {pastFixtures.length > 0 ? (
            <div className="space-y-3 opacity-60">
              {pastFixtures.reverse().map(f => (
                <FixtureCard key={f.id} fixture={f} onRemove={() => removeFixture(f.id)} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/30 italic">No past fixtures.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function FixtureCard({ fixture, onRemove }: { fixture: any, onRemove: () => void }) {
  const isHigh = fixture.importance === 'High';
  return (
    <div className={`group flex items-center justify-between p-4 rounded-xl border bg-[#121212] transition-colors ${
      isHigh ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'border-white/10'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg border ${
          isHigh ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'
        }`}>
          <span className="text-xs uppercase tracking-widest text-white/50 leading-none mb-1">
            {format(parseISO(fixture.date), 'MMM')}
          </span>
          <span className={`text-xl font-bold font-numeric leading-none ${isHigh ? 'text-red-400' : 'text-white'}`}>
            {format(parseISO(fixture.date), 'dd')}
          </span>
        </div>
        <div>
          <h3 className="text-base font-medium text-white">{fixture.opponent}</h3>
          <p className="text-xs text-white/50 flex items-center gap-2 mt-1">
            <span className={isHigh ? 'text-red-400 font-medium' : ''}>{fixture.importance} Importance</span>
          </p>
        </div>
      </div>
      <button 
        onClick={onRemove}
        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
