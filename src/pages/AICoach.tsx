import React, { useState } from 'react';
import { useAthlon } from '../context/AthlonContext';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Brain, Send, Shield, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

export function AICoach() {
  const { acuteLoad, chronicLoad, acwr, currentRisk, latestRecovery, plan, fixtures } = useAthlon();
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState('');

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''; // Not provided by AI Studio client-side usually, we'll simulate if missing
  const hasKey = !!apiKey;

  const getSnapshotText = () => {
    return `Current Metrics: Acute=${Math.round(acuteLoad)}, Chronic=${Math.round(chronicLoad)}, ACWR=${acwr.toFixed(2)}, Recovery=${latestRecovery}%, Risk=${currentRisk}.
Next Fixture: ${fixtures.find(f => f.date >= new Date().toISOString().split('T')[0])?.opponent || 'None'}.
Plan: ${plan.map(d => `${d.dayLabel}: ${d.targetLoad}AU (${d.rationale})`).join('; ')}
Rules: Match day=0 load. Day before match=40% load. Recovery<50% or ACWR>1.5=30% load. High importance match in 3 days=70% load. Otherwise=110% load.`;
  };

  const generateSummary = async () => {
    setIsTyping(true);
    setSummary('');
    if (!hasKey) {
      setTimeout(() => {
        setSummary(`Simulated summary based on data: The athlete is in ${currentRisk} with an ACWR of ${acwr.toFixed(2)}. Recovery is currently at ${latestRecovery}%. The deterministic engine has adjusted the 7-day plan accordingly to manage load and prepare for upcoming fixtures.`);
        setIsTyping(false);
      }, 1000);
      return;
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are ATHLON AI Coach. Provide a short 3-5 sentence performance summary grounded ONLY in this data. Explain the engine's reasoning. NEVER invent numbers.
        Data: ${getSnapshotText()}`
      });
      setSummary(response.text || 'Summary generated.');
    } catch (e) {
      setSummary('Failed to generate summary. Please check API configuration.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    if (!hasKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: `(Simulated response) The engine decided this based on the current ACWR of ${acwr.toFixed(2)} and Recovery of ${latestRecovery}%. The rules dictate that we adjust load to protect the athlete.`}]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are ATHLON AI Coach. Answer the user's question based ONLY on this snapshot. If asked to change a value, refuse and direct them to the Planner. NEVER invent numbers.
      Data: ${getSnapshotText()}
      User: ${userMsg}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'I cannot answer that right now.'}]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error communicating with AI service.'}]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col xl:flex-row gap-6">
      
      {/* Left: Metrics */}
      <div className="xl:w-1/4 flex flex-col gap-4 overflow-y-auto hidden lg:flex">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 px-1">Live Metrics</h2>
        <Card className="p-5">
          <p className="text-xs text-white/50 uppercase">ACWR</p>
          <p className="text-2xl font-numeric text-white">{acwr.toFixed(2)}</p>
          <div className="mt-2 text-xs font-medium px-2 py-1 bg-white/5 inline-block rounded">{currentRisk}</div>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-white/50 uppercase">Recovery</p>
          <p className="text-2xl font-numeric text-[var(--color-brand-lime)]">{latestRecovery}%</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-white/50 uppercase mb-2">Engine Rules</p>
          <ul className="text-xs text-white/70 space-y-2 font-mono">
            <li>1. Match Day = 0%</li>
            <li>2. MD-1 = 40%</li>
            <li>3. Rec&lt;50% / Risk = 30%</li>
            <li>4. Big Match MD-3 = 70%</li>
            <li>5. Default = 110%</li>
          </ul>
        </Card>
      </div>

      {/* Center: Chat Workspace */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#121212] border border-white/10 rounded-xl overflow-hidden relative">
        {!hasKey && (
          <div className="absolute top-0 left-0 right-0 bg-amber-500/10 text-amber-500 text-xs text-center py-1.5 border-b border-amber-500/20 z-10 flex justify-center items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            No Gemini API key provided. Running in simulated fallback mode.
          </div>
        )}
        
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-2 text-white">
            <Brain className="w-5 h-5 text-[var(--color-brand-cyan)]" />
            <h2 className="font-semibold">Performance Intelligence</h2>
          </div>
          <Button size="sm" variant="outline" onClick={generateSummary} disabled={isTyping}>
            Generate Summary
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/50">
              <Shield className="w-3 h-3" /> AI explains — rule engine decides
            </div>
          </div>

          {summary && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--color-brand-cyan)]/5 border border-[var(--color-brand-cyan)]/20 rounded-lg p-5">
              <h3 className="text-[var(--color-brand-cyan)] text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Executive Summary
              </h3>
              <p className="text-sm text-white/90 leading-relaxed">{summary}</p>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-white/10 text-white' 
                  : 'bg-black/50 border border-white/10 text-white/90'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && !summary && (
            <div className="flex justify-start">
              <div className="bg-black/50 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[var(--color-brand-cyan)] rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-[var(--color-brand-cyan)] rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 bg-[var(--color-brand-cyan)] rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-[var(--color-brand-cyan)] transition-colors"
              placeholder="Ask about the plan or metrics..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-2 p-1.5 text-white/50 hover:text-white disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right: Reasoning Context */}
      <div className="xl:w-1/4 flex flex-col gap-4 overflow-y-auto hidden xl:flex">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 px-1">Reasoning Context</h2>
        <Card className="flex-1 overflow-y-auto p-4 bg-black/40 border-dashed">
          <div className="space-y-4">
            {plan.slice(0, 3).map(day => (
              <div key={day.date} className="border-b border-white/5 pb-3 last:border-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">{day.dayLabel}</span>
                  <span className="text-xs text-[var(--color-brand-cyan)] font-numeric">{day.targetLoad} AU</span>
                </div>
                <p className="text-xs text-white/50 font-mono leading-tight">{day.rationale}</p>
              </div>
            ))}
            <div className="text-center pt-2">
              <span className="text-xs text-white/30 italic">Snapshot locked to AI</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
