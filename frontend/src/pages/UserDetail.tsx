import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUser, disableUser, enableUser, deleteUser } from '../lib/api'

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const userId = parseInt(id || '0')

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  })

  const disableMutation = useMutation({
    mutationFn: disableUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', userId] }),
  })

  const enableMutation = useMutation({
    mutationFn: enableUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', userId] }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted animate-pulse">Loading user details...</div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="bg-error/10 border border-error p-6 rounded-xl text-error">
        <h2 className="text-lg font-bold">Error</h2>
        <p>Failed to load user details. They might not exist or you might not have permission.</p>
        <Link to="/users" className="mt-4 inline-block text-sm underline">Back to Users</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/users" className="p-2 hover:bg-surface rounded-lg border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{user.email}</h1>
            <p className="text-text-muted text-sm">User ID: {user.id} • Joined {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {user.active ? (
            <button
              onClick={() => disableMutation.mutate(user.id)}
              className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 font-medium transition-colors"
              disabled={disableMutation.isPending}
            >
              Disable Account
            </button>
          ) : (
            <button
              onClick={() => enableMutation.mutate(user.id)}
              className="px-4 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 font-medium transition-colors"
              disabled={enableMutation.isPending}
            >
              Enable Account
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <div className="text-sm text-text-muted mb-1">Total Tasks</div>
          <div className="text-3xl font-bold text-text-primary">{user.total_tasks}</div>
          <div className="mt-2 text-xs text-text-muted">
            <span className="text-success font-medium">{user.completed_tasks}</span> completed
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <div className="text-sm text-text-muted mb-1">Projects</div>
          <div className="text-3xl font-bold text-text-primary">{user.total_projects}</div>
          <div className="mt-2 text-xs text-text-muted">Active projects</div>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <div className="text-sm text-text-muted mb-1">Last Login</div>
          <div className="text-xl font-bold text-text-primary">
            {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
          </div>
          <div className="mt-2 text-xs text-text-muted">Activity timestamp</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-background/50">
            <h3 className="font-bold text-text-primary">Recent Activity</h3>
          </div>
          <div className="divide-y divide-border">
            {user.recent_tasks && user.recent_tasks.length > 0 ? (
              user.recent_tasks.map((task) => (
                <div key={task.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-text-primary">{task.name}</div>
                    <div className="text-xs text-text-muted">{new Date(task.created_at).toLocaleString()}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                    task.status === 'completed' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center text-text-muted">No recent activity found.</div>
            )}
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-bold text-text-primary mb-4">Account Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">Verification Status</span>
              <span className={`text-sm font-medium ${user.email_verified ? 'text-success' : 'text-warning'}`}>
                {user.email_verified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">Account Status</span>
              <span className={`text-sm font-medium ${user.active ? 'text-success' : 'text-error'}`}>
                {user.active ? 'Active' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">Registration Date</span>
              <span className="text-sm font-medium text-text-primary">
                {new Date(user.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
