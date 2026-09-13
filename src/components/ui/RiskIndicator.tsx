import React from 'react';
import { cn } from '../../utils/helpers';
import type { RiskLevel } from '../../types';

export function RiskIndicator({ risk, className }: { risk: RiskLevel, className?: string }) {
  const getColors = (r: RiskLevel) => {
    switch (r) {
      case 'High Risk': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Moderate Risk': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Low Risk': return 'bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/30';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  return (
    <div className={cn("inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium tracking-wide uppercase", getColors(risk), className)}>
      {risk}
    </div>
  );
}
