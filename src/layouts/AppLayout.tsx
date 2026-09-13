import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Home, Calendar, ClipboardList, 
  History, Brain, Settings as SettingsIcon, Menu, X, Bell 
} from 'lucide-react';
import { useAthlon } from '../context/AthlonContext';
import { cn } from '../utils/helpers';

const NAV_ITEMS = [
  { path: '/app', label: 'Overview', icon: Home },
  { path: '/app/load', label: 'Training Load', icon: Activity },
  { path: '/app/recovery', label: 'Recovery', icon: Activity },
  { path: '/app/fixtures', label: 'Fixtures', icon: Calendar },
  { path: '/app/planner', label: 'Planner', icon: ClipboardList },
  { path: '/app/history', label: 'History', icon: History },
  { path: '/app/ai-coach', label: 'AI Coach', icon: Brain },
];

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { athlete, currentRisk, notifications } = useAthlon();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[#121212] border-r border-white/10 z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-[var(--color-brand-lime)]">
            <Activity className="w-5 h-5" />
            <span className="font-bold tracking-widest uppercase">Athlon</span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <NavLink
            to="/app/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              location.pathname === '/app/settings' ? "text-white bg-white/10" : "text-white/50 hover:text-white/80 hover:bg-white/5"
            )}
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#121212] border-b border-white/10 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-[var(--color-brand-lime)]">
          <Activity className="w-5 h-5" />
          <span className="font-bold tracking-widest uppercase">Athlon</span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 bottom-0 w-64 bg-[#121212] z-50 border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="h-16 flex items-center justify-end px-4 border-b border-white/10">
                <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 py-6 px-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                      isActive ? "bg-white/10 text-white" : "text-white/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 lg:px-10 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-bold text-white">{athlete.name}</h2>
              <p className="text-xs text-white/50">{athlete.position}</p>
            </div>
            <div className="hidden sm:block h-8 w-px bg-white/10 mx-2" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-white/50 uppercase tracking-wider">Status</span>
              <span className={cn(
                "text-xs font-bold uppercase tracking-wider",
                currentRisk === 'Low Risk' ? "text-[#ccff00]" :
                currentRisk === 'Moderate Risk' ? "text-amber-500" :
                currentRisk === 'High Risk' ? "text-red-500" : "text-white/70"
              )}>
                {currentRisk === 'Low Risk' ? 'TRAINING READY' : currentRisk}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-medium text-white">C</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-6xl mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
