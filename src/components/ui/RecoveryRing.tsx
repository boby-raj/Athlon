import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/helpers';

interface RecoveryRingProps {
  value: number; // 0-100
  size?: number;
  className?: string;
}

export function RecoveryRing({ value, size = 120, className }: RecoveryRingProps) {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = 'var(--color-status-danger)';
  if (value >= 60) color = 'var(--color-status-optimal)';
  else if (value >= 40) color = 'var(--color-status-caution)';

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-numeric font-light text-white flex items-baseline">
          {value}<span className="text-sm text-white/50 ml-0.5">%</span>
        </span>
      </div>
    </div>
  );
}
