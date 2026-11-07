import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  title: string;
  onMenuOpen?: () => void;
}

export function Header({ title, onMenuOpen }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between px-4 sm:px-6 shrink-0 border-b border-white/[0.06]"
            style={{ background: 'rgba(10, 20, 40, 0.90)', backdropFilter: 'blur(12px)' }}>

      <div className="flex items-center gap-3">
        {/* Botão hamburger — só visível no mobile (< lg) */}
        <button
          onClick={onMenuOpen}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95 shrink-0"
          aria-label="Abrir menu"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor" aria-hidden="true">
            <rect y="0"  width="18" height="2" rx="1"/>
            <rect y="6"  width="13" height="2" rx="1"/>
            <rect y="12" width="18" height="2" rx="1"/>
          </svg>
        </button>

        <h2 className="text-sm font-semibold text-white/80 tracking-wide">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium text-white leading-tight">{user?.nome ?? '—'}</p>
          <p className="text-[10px] capitalize" style={{ color: '#00E5FF' }}>{user?.perfil ?? ''}</p>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
             style={{ background: 'linear-gradient(135deg, #00E5FF, #0077FF)', boxShadow: '0 0 10px rgba(0,229,255,0.35)' }}>
          {user?.nome?.[0]?.toUpperCase() ?? '?'}
        </div>
      </div>
    </header>
  );
}
