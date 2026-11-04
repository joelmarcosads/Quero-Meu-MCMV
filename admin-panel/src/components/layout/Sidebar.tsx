import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',             label: 'Dashboard', icon: '◈', end: true },
  { to: '/leads',        label: 'Leads',     icon: '⬡' },
  { to: '/contatos',     label: 'Contatos',  icon: '◎' },
  { to: '/oportunidades',label: 'Pipeline',  icon: '◇' },
];

export function Sidebar() {
  return (
    <aside className="w-60 min-h-screen flex flex-col shrink-0 border-r border-white/[0.06]"
           style={{ background: 'linear-gradient(180deg, #0d1f3c 0%, #071426 100%)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
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
  );
}
