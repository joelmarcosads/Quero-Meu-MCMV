interface PaginationProps {
  offset: number;
  limit: number;
  count: number;
  onPageChange: (offset: number) => void;
}

export function Pagination({ offset, limit, count, onPageChange }: PaginationProps) {
  const page = Math.floor(offset / limit) + 1;
  const hasPrev = offset > 0;
  const hasNext = count === limit; // se veio cheio, pode ter mais

  if (!hasPrev && !hasNext) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Página {page}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          disabled={!hasPrev}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40
                     hover:bg-gray-50 transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={() => onPageChange(offset + limit)}
          disabled={!hasNext}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40
                     hover:bg-gray-50 transition-colors"
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
