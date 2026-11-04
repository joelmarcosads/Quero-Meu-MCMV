import type { ReactNode } from 'react';

interface BadgeProps {
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  children?: ReactNode;
}

const VARIANT_STYLES: Record<string, string> = {
  success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
  warning: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/20',
  danger:  'bg-red-500/15 text-red-300 border border-red-500/20',
  info:    'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20',
  default: 'bg-white/8 text-slate-300 border border-white/10',
};

export function Badge({ label, variant, className = '', children }: BadgeProps) {
  const variantClass = variant ? VARIANT_STYLES[variant] : '';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${variantClass} ${className}`}>
      {children ?? label}
    </span>
  );
}
