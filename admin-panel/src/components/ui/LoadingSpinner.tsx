interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  label?: string;
}

const SIZE_MAP = { sm: 20, md: 32, lg: 48 };

export function LoadingSpinner({ size = 'md', fullPage = false, label }: LoadingSpinnerProps) {
  const px = SIZE_MAP[size];

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <svg width={px} height={px} viewBox="0 0 50 50" className="animate-spin">
        <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="4"/>
        <path d="M25 5 A20 20 0 0 1 45 25" fill="none" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round"/>
      </svg>
      {label && <p className="text-xs text-slate-400">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {spinner}
      </div>
    );
  }

  return spinner;
}
