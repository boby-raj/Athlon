import React from 'react';
import { cn } from '../../utils/helpers';
import { motion, HTMLMotionProps } from 'motion/react';

interface CardProps extends HTMLMotionProps<"div"> {
  gradient?: boolean;
}

export function Card({ className, children, gradient, ...props }: CardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-xl border border-white/5 bg-[#121212] overflow-hidden",
        "backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
      )}
      <div className="relative z-10 p-5">
        {children}
      </div>
    </motion.div>
  );
}

export function CardHeader({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn("flex items-center justify-between mb-4", className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string, children: React.ReactNode }) {
  return <h3 className={cn("text-sm font-medium tracking-wide text-white/80 uppercase", className)}>{children}</h3>;
}
