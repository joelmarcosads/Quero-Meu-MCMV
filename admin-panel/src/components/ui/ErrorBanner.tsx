interface ErrorBannerProps {
  message?: string | null;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="rounded-xl px-4 py-3 flex items-start gap-3 text-sm"
         style={{ background: 'rgba(255,77,109,0.10)', border: '1px solid rgba(255,77,109,0.20)' }}>
      <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="#FF4D6D" strokeWidth="1.5"/>
        <path d="M10 6v4M10 13v1" stroke="#FF4D6D" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className="text-red-300 flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry}
                className="text-xs text-red-300/70 hover:text-red-300 underline underline-offset-2 shrink-0 transition-colors">
          Tentar novamente
        </button>
      )}
    </div>
  );
}
