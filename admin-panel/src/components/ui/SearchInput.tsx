interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Buscar…', className = '' }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
           viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="5" stroke="#64748B" strokeWidth="1.5"/>
        <path d="M11 11l3 3" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-3 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-cyan-500/40 focus:bg-white/8 focus:ring-1 focus:ring-cyan-500/20"
      />
      {value && (
        <button onClick={() => onChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded text-slate-500 hover:text-slate-300 transition-colors">
          ×
        </button>
      )}
    </div>
  );
}
