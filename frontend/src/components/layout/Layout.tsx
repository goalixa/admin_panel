import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/users', label: 'Users' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/health', label: 'Health' },
  { path: '/settings', label: 'Settings' },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen flex">
      <Sidebar navItems={navItems} currentPath={location.pathname} />
      <div className="flex-1 ml-60">
        <Header />
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}