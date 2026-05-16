import { useAuthStore } from '../../stores/auth'

export default function Header() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-8">
      <div className="text-sm text-text-muted">Admin Panel</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-text-primary">
          {user?.email || 'Admin'}
        </div>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-sm text-white font-medium">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </span>
        </div>
      </div>
    </header>
  )
}