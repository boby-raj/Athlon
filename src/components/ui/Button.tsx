import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/helpers';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    const variants = {
      primary: "bg-[var(--color-brand-lime)] text-black hover:bg-[var(--color-brand-lime-hover)] font-medium",
      secondary: "bg-white/10 text-white hover:bg-white/15",
      outline: "border border-white/20 text-white hover:bg-white/5",
      ghost: "text-white/70 hover:text-white hover:bg-white/5",
      danger: "bg-red-500/20 text-red-500 hover:bg-red-500/30",
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-lime)]/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
