import React, { useState } from 'react';
import { useAthlon } from '../context/AthlonContext';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Download, FileText, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import type { PlanDay } from '../types';

export function Planner() {
  const { plan, regeneratePlan, updatePlanDay, resetPlan } = useAthlon();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [editingDay, setEditingDay] = useState<string | null>(null);

  const steps = [
    "Analyzing Workload",
    "Analyzing Recovery",
    "Checking Fixtures",
    "Applying Rules",
    "Generating Plan"
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(0);
    
    // Simulate steps
    const runSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        setGenerationStep(i + 1);
      }
      regeneratePlan();
      setTimeout(() => setIsGenerating(false), 500);
    };
    runSteps();
  };

  const exportCSV = () => {
    const headers = "Date,Day,Session Type,Target Load (AU),Focus,Rationale\n";
    const rows = plan.map(d => 
      `${d.date},${d.dayLabel},${d.sessionType},${d.targetLoad},"${d.trainingFocus}","${d.rationale}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athlon_plan_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">7-Day Planner</h1>
          <p className="text-sm text-white/50 mt-1">Deterministic rule-based training prescription.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={resetPlan}>
            Reset to Agent Plan
          </Button>
          <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Generate Plan
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-[var(--color-brand-cyan)]/5 border-[var(--color-brand-cyan)]/20 p-6 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center max-w-sm w-full">
                <RefreshCw className="w-8 h-8 text-[var(--color-brand-cyan)] animate-spin mb-4" />
                <h3 className="text-lg font-medium text-white mb-6">Running Deterministic Engine</h3>
                <div className="w-full space-y-3">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${generationStep > idx ? 'bg-[var(--color-brand-lime)] text-black' : 'border border-white/20'}`}>
                        {generationStep > idx && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={`text-sm ${generationStep > idx ? 'text-white' : generationStep === idx ? 'text-white animate-pulse' : 'text-white/30'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {plan.map((day, idx) => (
          <PlanDayCard 
            key={day.date} 
            day={day} 
            isEditing={editingDay === day.date}
            onEdit={() => setEditingDay(editingDay === day.date ? null : day.date)}
            onSave={(updates) => {
              updatePlanDay(day.date, updates);
              setEditingDay(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PlanDayCard({ day, isEditing, onEdit, onSave }: { 
  day: PlanDay, 
  isEditing: boolean, 
  onEdit: () => void,
  onSave: (updates: Partial<PlanDay>) => void 
}) {
  const [draft, setDraft] = useState({
    sessionType: day.sessionType,
    targetLoad: day.targetLoad,
    trainingFocus: day.trainingFocus
  });

  // Keep draft in sync if day updates externally
  React.useEffect(() => {
    setDraft({
      sessionType: day.sessionType,
      targetLoad: day.targetLoad,
      trainingFocus: day.trainingFocus
    });
  }, [day]);

  const handleSave = () => {
    onSave(draft);
  };

  const isMatch = day.sessionType === 'Match';
  const isRecovery = day.targetLoad < 300 && !isMatch;

  return (
    <Card className={`transition-colors ${isMatch ? 'border-red-500/30 bg-red-500/5' : isRecovery ? 'border-[var(--color-brand-cyan)]/30 bg-[var(--color-brand-cyan)]/5' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        
        {/* Date block */}
        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-black/40 border border-white/10 shrink-0">
          <span className="text-sm font-bold text-white/50 uppercase tracking-wider">{day.dayLabel}</span>
          <span className="text-2xl font-numeric text-white">{day.date.split('-')[2]}</span>
        </div>

        {/* Info block */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Session Type</p>
            <p className="text-sm font-medium text-white">{day.sessionType}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Target Load</p>
            <p className="text-sm font-medium text-white font-numeric">{day.targetLoad} AU</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Focus</p>
            <p className="text-sm font-medium text-white">{day.trainingFocus}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between md:justify-end gap-4 md:w-48 shrink-0">
          {day.isOverridden && (
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest border border-amber-500/30 px-2 py-1 rounded">Overridden</span>
          )}
          <button onClick={onEdit} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
            {isEditing ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Edit View */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 mt-6 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Session Type</label>
                  <select 
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-brand-cyan)]"
                    value={draft.sessionType}
                    onChange={(e) => setDraft({...draft, sessionType: e.target.value})}
                  >
                    <option value="Training">Training</option>
                    <option value="Match">Match</option>
                    <option value="Recovery">Recovery</option>
                    <option value="Rest">Rest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Target Load (AU)</label>
                  <input 
                    type="number"
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-brand-cyan)] font-numeric"
                    value={draft.targetLoad}
                    onChange={(e) => setDraft({...draft, targetLoad: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Training Focus</label>
                  <input 
                    type="text"
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-brand-cyan)]"
                    value={draft.trainingFocus}
                    onChange={(e) => setDraft({...draft, trainingFocus: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-white/5 mb-6">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Engine Rationale</p>
                <p className="text-sm font-mono text-white/80">{day.rationale}</p>
                {day.isOverridden && (
                  <p className="text-xs text-amber-500/80 mt-2">
                    Original target: {day.originalValues?.targetLoad} AU
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={onEdit}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleSave}>Save Override</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
