import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/leads', label: 'Leads', icon: '📋' },
  { to: '/contatos', label: 'Contatos', icon: '👥' },
  { to: '/oportunidades', label: 'Pipeline', icon: '🏗️' },
];

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#1e3a5f] text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-tight">Market Imobi</h1>
        <p className="text-xs text-blue-200 mt-0.5">Painel CRM</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-blue-200">© 2026 Market Imobi</p>
      </div>
    </aside>
  );
}
