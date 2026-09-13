import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingLayout() {
  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Premium ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-brand-cyan)]/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-brand-lime)]/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--color-brand-lime)]">
          <Activity className="w-6 h-6" />
          <span className="font-bold tracking-[0.2em] uppercase text-lg">Athlon</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#overview" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Overview</a>
          <a href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</a>
          <a href="#performance" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Performance</a>
          <a href="#ai-coach" className="text-sm font-medium text-white/70 hover:text-white transition-colors">AI Coach</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/app">
            <Button variant="primary">Sign In / Launch App</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 relative z-10 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
