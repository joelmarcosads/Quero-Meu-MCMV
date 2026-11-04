import type { ReactNode } from 'react';

interface BadgeProps {
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  children?: ReactNode;
}

export function Badge({ label, variant, className = '', children }: BadgeProps) {
  const variantClass =
    variant === 'success' ? 'bg-green-100 text-green-800' :
    variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
    variant === 'danger'  ? 'bg-red-100 text-red-800' :
    variant === 'default' ? 'bg-gray-100 text-gray-700' :
    '';                     // usa className externo quando não há variant

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantClass} ${className}`}>
      {children ?? label}
    </span>
  );
}
