interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <span className="text-red-500 text-lg shrink-0">⚠️</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-800">Erro ao carregar dados</p>
        <p className="text-sm text-red-600 mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 text-sm text-red-700 hover:text-red-900 font-medium underline"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
