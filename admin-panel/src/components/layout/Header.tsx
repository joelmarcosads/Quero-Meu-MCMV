import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800 leading-tight">{user?.nome ?? '—'}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.perfil ?? ''}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold">
          {user?.nome?.[0]?.toUpperCase() ?? '?'}
        </div>
      </div>
    </header>
  );
}
