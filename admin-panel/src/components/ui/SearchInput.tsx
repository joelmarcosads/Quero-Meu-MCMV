import { InputHTMLAttributes, useRef } from 'react';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function SearchInput({ onSearch, debounceMs = 400, ...props }: SearchInputProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(e.target.value), debounceMs);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        type="search"
        onChange={handleChange}
        className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30
                   focus:border-[#1e3a5f] w-full sm:w-72"
        {...props}
      />
    </div>
  );
}
