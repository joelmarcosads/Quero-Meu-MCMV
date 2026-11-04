interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: string;
}

export function EmptyState({ title = 'Nenhum resultado', description, action, icon = '◈' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
           style={{ background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.12)' }}>
        {icon}
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-slate-200">{title}</p>
        {description && <p className="text-xs text-slate-500 max-w-xs">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
