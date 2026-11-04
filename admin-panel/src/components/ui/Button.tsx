import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

const BASE = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed';

const VARIANTS: Record<string, string> = {
  primary: 'text-[#071426] focus:ring-cyan-400',
  secondary: 'border border-white/10 text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 bg-white/5 hover:bg-white/8 focus:ring-cyan-500/40',
  ghost: 'text-slate-400 hover:text-white hover:bg-white/8 focus:ring-white/20',
  danger: 'bg-red-500/15 text-red-300 border border-red-500/20 hover:bg-red-500/25 focus:ring-red-500/40',
};

const SIZES: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs h-7',
  md: 'px-4 py-2 text-sm h-9',
  lg: 'px-5 py-2.5 text-sm h-10',
};

export function Button({ variant = 'primary', size = 'md', children, loading, className = '', disabled, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      style={isPrimary ? {
        background: 'linear-gradient(135deg, #00E5FF, #0077FF)',
        boxShadow: '0 0 14px rgba(0,229,255,0.30)',
      } : {}}
    >
      {loading && (
        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  );
}
