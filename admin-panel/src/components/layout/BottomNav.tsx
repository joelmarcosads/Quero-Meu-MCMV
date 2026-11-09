import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',              label: 'Dashboard', icon: '◈', end: true },
  { to: '/leads',         label: 'Leads',     icon: '⬡' },
  { to: '/contatos',      label: 'Contatos',  icon: '◎' },
  { to: '/oportunidades', label: 'Pipeline',  icon: '◇' },
  { to: '/conflitos',     label: 'Conflitos', icon: '⚡' },
];

export function BottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.08]"
      style={{ background: 'rgba(7, 20, 38, 0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <ul className="flex">
        {NAV_ITEMS.map(item => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 w-full transition-colors ${
                  isActive ? '' : 'text-slate-500 active:text-slate-300'
                }`
              }
              style={({ isActive }) => isActive ? { color: '#00E5FF' } : {}}
            >
              <span className="text-[20px] leading-none">{item.icon}</span>
              <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      {/* Espaço para safe area do iOS (home indicator) */}
      <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );
}
