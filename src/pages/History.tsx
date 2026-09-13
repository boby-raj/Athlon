import React, { useState } from 'react';
import { useAthlon } from '../context/AthlonContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { format, parseISO } from 'date-fns';
import { Plus, Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';
import type { TrainingSession } from '../types';

export function History() {
  const { sessions, addSession, importSessions } = useAthlon();
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const sortedSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Training History</h1>
          <p className="text-sm text-white/50 mt-1">Review past sessions and import data.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowImport(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Log Session
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <LogSessionForm onClose={() => setShowAdd(false)} onSave={addSession} />
        )}
        {showImport && (
          <CSVImporter onClose={() => setShowImport(false)} onImport={importSessions} />
        )}
      </AnimatePresence>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white/50 uppercase bg-black/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">Date</th>
                <th className="px-6 py-4 font-medium tracking-wider">Load (AU)</th>
                <th className="px-6 py-4 font-medium tracking-wider">Distance (km)</th>
                <th className="px-6 py-4 font-medium tracking-wider">RPE</th>
                <th className="px-6 py-4 font-medium tracking-wider">Recovery %</th>
                <th className="px-6 py-4 font-medium tracking-wider">Sleep (hrs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {sortedSessions.map((session) => (
                <tr key={session.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {format(parseISO(session.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 font-numeric text-[var(--color-brand-cyan)] font-medium">
                    {session.workload}
                  </td>
                  <td className="px-6 py-4 font-numeric text-white/70">
                    {session.distance ?? '--'}
                  </td>
                  <td className="px-6 py-4 font-numeric text-white/70">
                    {session.rpe ?? '--'}
                  </td>
                  <td className="px-6 py-4 font-numeric text-[var(--color-brand-lime)]">
                    {session.recovery ?? '--'}
                  </td>
                  <td className="px-6 py-4 font-numeric text-white/70">
                    {session.sleep ?? '--'}
                  </td>
                </tr>
              ))}
              {sortedSessions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/30">
                    No training sessions logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function LogSessionForm({ onClose, onSave }: { onClose: () => void, onSave: (s: Omit<TrainingSession, 'id'>) => void }) {
  const [draft, setDraft] = useState({
    date: new Date().toISOString().split('T')[0],
    workload: '',
    distance: '',
    rpe: '',
    recovery: '',
    sleep: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStep, setSaveStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.date || !draft.workload) return;

    setIsSaving(true);
    setSaveStep(1); // Saving
    setTimeout(() => setSaveStep(2), 600); // Analyzing
    setTimeout(() => setSaveStep(3), 1200); // Regenerating Plan
    setTimeout(() => {
      onSave({
        date: draft.date,
        workload: Number(draft.workload),
        distance: draft.distance ? Number(draft.distance) : undefined,
        rpe: draft.rpe ? Number(draft.rpe) : undefined,
        recovery: draft.recovery ? Number(draft.recovery) : undefined,
        sleep: draft.sleep ? Number(draft.sleep) : undefined
      });
      onClose();
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Card className="border-[var(--color-brand-cyan)]/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Log Training Session</h2>
          <button onClick={onClose} disabled={isSaving} className="text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSaving ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-8 h-8 border-2 border-[var(--color-brand-cyan)] border-t-transparent rounded-full animate-spin" />
            <div className="text-sm font-medium text-[var(--color-brand-cyan)]">
              {saveStep === 1 && "Saving data..."}
              {saveStep === 2 && "Analyzing metrics..."}
              {saveStep === 3 && "Regenerating plan..."}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Date *</label>
                <input type="date" required className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-brand-cyan)] outline-none" value={draft.date} onChange={e => setDraft({...draft, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Workload (AU) *</label>
                <input type="number" required className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-brand-cyan)] outline-none font-numeric" value={draft.workload} onChange={e => setDraft({...draft, workload: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Distance (km)</label>
                <input type="number" step="0.1" className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-brand-cyan)] outline-none font-numeric" value={draft.distance} onChange={e => setDraft({...draft, distance: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">RPE (1-10)</label>
                <input type="number" min="1" max="10" className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-brand-cyan)] outline-none font-numeric" value={draft.rpe} onChange={e => setDraft({...draft, rpe: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Recovery (0-100%)</label>
                <input type="number" min="0" max="100" className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-brand-cyan)] outline-none font-numeric" value={draft.recovery} onChange={e => setDraft({...draft, recovery: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Sleep (hrs)</label>
                <input type="number" step="0.1" className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-brand-cyan)] outline-none font-numeric" value={draft.sleep} onChange={e => setDraft({...draft, sleep: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Session</Button>
            </div>
          </form>
        )}
      </Card>
    </motion.div>
  );
}

function CSVImporter({ onClose, onImport }: { onClose: () => void, onImport: (sessions: TrainingSession[]) => void }) {
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload');
  const [fileData, setFileData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({
    date: '', workload: '', distance: '', rpe: '', recovery: '', sleep: ''
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(results.meta.fields || []);
        setFileData(results.data);
        
        // Auto-guess mappings
        const guess = { date: '', workload: '', distance: '', rpe: '', recovery: '', sleep: '' };
        (results.meta.fields || []).forEach(f => {
          const l = f.toLowerCase();
          if (l.includes('date') || l === 'day') guess.date = f;
          if (l.includes('load') || l.includes('au')) guess.workload = f;
          if (l.includes('dist')) guess.distance = f;
          if (l.includes('rpe')) guess.rpe = f;
          if (l.includes('recov')) guess.recovery = f;
          if (l.includes('sleep')) guess.sleep = f;
        });
        setMappings(guess);
        setStep('map');
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] }, maxFiles: 1 });

  const handleImport = () => {
    const sessions = fileData.map((row, i) => {
      const parsed: TrainingSession = {
        id: `imp-${Date.now()}-${i}`,
        date: String(row[mappings.date] || ''),
        workload: Number(row[mappings.workload]) || 0
      };
      if (mappings.distance && row[mappings.distance]) parsed.distance = Number(row[mappings.distance]);
      if (mappings.rpe && row[mappings.rpe]) parsed.rpe = Number(row[mappings.rpe]);
      if (mappings.recovery && row[mappings.recovery]) parsed.recovery = Number(row[mappings.recovery]);
      if (mappings.sleep && row[mappings.sleep]) parsed.sleep = Number(row[mappings.sleep]);
      return parsed;
    }).filter(s => s.date && s.workload > 0);
    
    onImport(sessions);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
      <Card className="border-[var(--color-brand-cyan)]/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Import CSV Data</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {step === 'upload' && (
          <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-[var(--color-brand-cyan)] bg-[var(--color-brand-cyan)]/5' : 'border-white/20 hover:border-white/40'}`}>
            <input {...getInputProps()} />
            <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white font-medium">Drag & drop CSV file here</p>
            <p className="text-sm text-white/50 mt-1">or click to select file</p>
          </div>
        )}

        {step === 'map' && (
          <div className="space-y-6">
            <p className="text-sm text-white/70">Map your CSV columns to ATHLON fields.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(mappings).map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-xs text-white/50 uppercase tracking-widest mb-1">{field} {field === 'date' || field === 'workload' ? '*' : ''}</label>
                  <select 
                    className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-brand-cyan)] outline-none"
                    value={mappings[field as keyof typeof mappings]}
                    onChange={e => setMappings({...mappings, [field]: e.target.value})}
                  >
                    <option value="">-- Ignore --</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setStep('upload')}>Back</Button>
              <Button onClick={() => setStep('preview')} disabled={!mappings.date || !mappings.workload}>Preview Data</Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            <p className="text-sm text-white/70">Previewing first 3 rows. This will replace all existing training data.</p>
            <div className="overflow-x-auto border border-white/10 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-black/50 text-white/50 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Load</th>
                    <th className="px-4 py-2">Dist</th>
                    <th className="px-4 py-2">RPE</th>
                    <th className="px-4 py-2">Rec</th>
                    <th className="px-4 py-2">Sleep</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-white">
                  {fileData.slice(0, 3).map((row, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2">{row[mappings.date]}</td>
                      <td className="px-4 py-2">{row[mappings.workload]}</td>
                      <td className="px-4 py-2">{mappings.distance ? row[mappings.distance] : '--'}</td>
                      <td className="px-4 py-2">{mappings.rpe ? row[mappings.rpe] : '--'}</td>
                      <td className="px-4 py-2">{mappings.recovery ? row[mappings.recovery] : '--'}</td>
                      <td className="px-4 py-2">{mappings.sleep ? row[mappings.sleep] : '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setStep('map')}>Back</Button>
              <Button onClick={handleImport} variant="danger">Import & Replace Data</Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
