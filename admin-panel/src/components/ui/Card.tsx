import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export function Card({ children, className = '', glow = false, hover = false }: CardProps) {
  return (
    <div
      className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}
      style={glow ? { borderColor: 'rgba(0,229,255,0.20)', boxShadow: '0 4px 24px rgba(0,0,0,0.40), 0 0 0 1px rgba(0,229,255,0.08)' } : {}}
    >
      {children}
    </div>
  );
}
