interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPage, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-end gap-2 ${className}`}>
      <span className="text-xs text-slate-500 mr-2">
        Página <span className="text-slate-300">{page}</span> de <span className="text-slate-300">{totalPages}</span>
      </span>
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-white/10 bg-white/5 hover:border-cyan-500/30 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs"
      >‹</button>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-white/10 bg-white/5 hover:border-cyan-500/30 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs"
      >›</button>
    </div>
  );
}
