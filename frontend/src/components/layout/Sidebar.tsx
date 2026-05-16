import { Link, useLocation } from 'react-router-dom'
import { logout } from '../../lib/auth'

interface NavItem {
  path: string
  label: string
}

interface SidebarProps {
  navItems: NavItem[]
  currentPath: string
}

export default function Sidebar({ navItems, currentPath }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 w-60 h-screen bg-surface border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/" className="text-xl font-bold text-text-primary">
          Goalixa Admin
        </Link>
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-lg mb-1 transition-colors ${
              currentPath === item.path
                ? 'bg-primary/10 text-primary'
                : 'text-text-muted hover:bg-background hover:text-text-primary'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="w-full px-4 py-3 text-left text-error hover:bg-error/10 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}