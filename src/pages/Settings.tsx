import React from 'react';
import { useAthlon } from '../context/AthlonContext';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Settings as SettingsIcon, Monitor, Bell, RotateCcw, Trash2 } from 'lucide-react';

export function Settings() {
  const { settings, updateSettings, clearDemoData } = useAthlon();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-sm text-white/50 mt-1">Manage application preferences and data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Monitor className="w-4 h-4" /> Appearance</CardTitle>
          </CardHeader>
          <div className="space-y-6 mt-4">
            <div>
              <label className="text-sm font-medium text-white block mb-3">Theme</label>
              <div className="flex gap-3">
                <button 
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${settings.theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/50 hover:bg-white/5'}`}
                >
                  Dark (Premium)
                </button>
                <button 
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${settings.theme === 'light' ? 'bg-black/10 border-black/20 text-black' : 'bg-transparent border-white/5 text-white/50 hover:bg-white/5'}`}
                >
                  Light
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-white block">Reduced Motion</label>
                <p className="text-xs text-white/50">Minimize animations and transitions.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.reducedMotion} onChange={e => updateSettings({ reducedMotion: e.target.checked })} />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand-cyan)]"></div>
              </label>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</CardTitle>
          </CardHeader>
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-white block">System Alerts</label>
                <p className="text-xs text-white/50">Receive workload and risk alerts.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.notifications} onChange={e => updateSettings({ notifications: e.target.checked })} />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand-cyan)]"></div>
              </label>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Danger Zone</CardTitle>
        </CardHeader>
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white font-medium">Reset Application Data</p>
            <p className="text-xs text-white/50 mt-1">Clear all local storage and reload demo seed data.</p>
          </div>
          <Button variant="danger" onClick={clearDemoData}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
