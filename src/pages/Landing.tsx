import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Activity, Zap, Shield, Brain } from 'lucide-react';

export function Landing() {
  return (
    <div className="flex-1 flex items-center justify-center pt-10 pb-20 px-6">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left text content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/80 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-cyan)] animate-pulse" />
            Performance Intelligence
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Turn athlete data into <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-cyan)] to-[var(--color-brand-lime)]">
              smarter training decisions.
            </span>
          </h1>
          
          <p className="text-lg text-white/60 max-w-xl leading-relaxed">
            ATHLON combines workload analytics, recovery data, fixture awareness, and deterministic training rules into a single command center. 
            Stop guessing. Start optimizing.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/app">
              <Button size="lg" className="w-full sm:w-auto text-base">Launch Simulator</Button>
            </Link>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base">Explore Architecture</Button>
          </div>
          
          <div className="grid grid-cols-2 gap-6 pt-12 border-t border-white/10">
            <div>
              <div className="flex items-center gap-2 text-white mb-2">
                <Shield className="w-4 h-4 text-[var(--color-brand-cyan)]" />
                <h3 className="font-semibold text-sm">Deterministic Engine</h3>
              </div>
              <p className="text-sm text-white/50">Rule-based workload prescriptions tied to biological readiness.</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-white mb-2">
                <Brain className="w-4 h-4 text-[var(--color-brand-lime)]" />
                <h3 className="font-semibold text-sm">Grounded AI</h3>
              </div>
              <p className="text-sm text-white/50">Context-aware insights that explain the math, but never invent it.</p>
            </div>
          </div>
        </motion.div>

        {/* Right Abstract Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-8 border border-white/5 rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]" />
          
          {/* Main Visual Panel */}
          <div className="relative w-full max-w-md aspect-square bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col justify-between shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Live Telemetry</p>
                <div className="text-2xl font-numeric text-white">System Optimal</div>
              </div>
              <Activity className="w-6 h-6 text-[var(--color-brand-lime)]" />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Acute:Chronic Ratio</span>
                  <span className="text-[var(--color-brand-cyan)] font-numeric">1.14</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-[var(--color-brand-cyan)]"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Recovery Index</span>
                  <span className="text-[var(--color-brand-lime)] font-numeric">86%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '86%' }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                    className="h-full bg-[var(--color-brand-lime)]"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[var(--color-brand-lime)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[var(--color-brand-lime)]" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest">Recommended Status</p>
                <p className="text-sm font-medium text-white">Proceed with dev load</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
