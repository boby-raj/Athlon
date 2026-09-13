import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/helpers';

interface ACWRGaugeProps {
  value: number;
  size?: number;
  className?: string;
}

export function ACWRGauge({ value, size = 160, className }: ACWRGaugeProps) {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Semicircle
  const arcLength = circumference / 2;
  
  // Calculate percentage (0.5 to 2.0 mapping to 0 to 1)
  const min = 0.5;
  const max = 2.0;
  const clampedValue = Math.max(min, Math.min(max, value));
  const percent = (clampedValue - min) / (max - min);
  
  const strokeDashoffset = arcLength - (percent * arcLength);

  let color = 'var(--color-status-info)'; // Default
  if (value < 0.8) color = 'var(--color-status-info)'; // Under
  else if (value <= 1.3) color = 'var(--color-status-optimal)'; // Sweet spot
  else if (value <= 1.5) color = 'var(--color-status-caution)'; // Caution
  else color = 'var(--color-status-danger)'; // Danger

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)} style={{ width: size, height: size / 2 + 20 }}>
      <svg width={size} height={size / 2} className="overflow-visible">
        {/* Background track */}
        <path
          d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Zones (0.8 - 1.3 sweet spot) */}
        {/* This is a simplified visual, actual value driven by path below */}
        
        {/* Value path */}
        <motion.path
          d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${arcLength}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-numeric font-light text-white"
        >
          {value.toFixed(2)}
        </motion.span>
        <span className="text-xs text-white/50 uppercase tracking-widest mt-1">ACWR</span>
      </div>
    </div>
  );
}
