import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',             label: 'Dashboard', icon: '◈', end: true },
  { to: '/leads',        label: 'Leads',     icon: '⬡' },
  { to: '/contatos',     label: 'Contatos',  icon: '◎' },
  { to: '/oportunidades',label: 'Pipeline',  icon: '◇' },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop — mobile only, visível quando o menu está aberto */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          // Posicionamento
          'fixed lg:static inset-y-0 left-0 z-50',
          // Dimensões
          'w-64 lg:w-60 min-h-screen flex flex-col shrink-0',
          // Borda
          'border-r border-white/[0.06]',
          // Animação de slide — mobile abre/fecha, desktop sempre visível
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{ background: 'linear-gradient(180deg, #0d1f3c 0%, #071426 100%)' }}
      >

        {/* Logo + botão fechar (mobile) */}
        <div className="px-5 py-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                 style={{ background: 'linear-gradient(135deg, #00E5FF, #0077FF)', boxShadow: '0 0 12px rgba(0,229,255,0.4)' }}>
              M
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none tracking-tight">Market Imobi</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#00E5FF' }}>CRM Premium</p>
            </div>
          </div>
          {/* Botão fechar — só aparece no mobile */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
             style={{ color: '#64748B' }}>Menu</p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                    }`
                  }
                  style={({ isActive }) => isActive ? {
                    background: 'rgba(0,229,255,0.10)',
                    borderLeft: '2px solid #00E5FF',
                    paddingLeft: '10px',
                    color: '#00E5FF',
                    boxShadow: 'inset 0 0 12px rgba(0,229,255,0.05)',
                  } : {}}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/[0.06]">
          <p className="text-[10px]" style={{ color: '#64748B' }}>
            © {new Date().getFullYear()} Market Imobi
          </p>
        </div>
      </aside>
    </>
  );
}
