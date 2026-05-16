import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, disableUser, enableUser, deleteUser, User } from '../lib/api'

export default function Users() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers({ page, per_page: 20 }),
  })

  const disableMutation = useMutation({
    mutationFn: disableUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  const enableMutation = useMutation({
    mutationFn: enableUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  const totalPages = Math.ceil((data?.total ?? 0) / 20)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>
        <p className="text-text-muted">Manage platform users</p>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-sm font-medium text-text-muted">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-text-muted">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-text-muted">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-text-muted">Verified</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-text-muted">Created</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((user: User) => (
              <tr key={user.id} className="border-b border-border">
                <td className="px-6 py-4 text-text-primary font-mono">{user.id}</td>
                <td className="px-6 py-4 text-text-primary">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.active
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error'
                    }`}
                  >
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.email_verified
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {user.email_verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-muted text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {user.active ? (
                      <button
                        onClick={() => disableMutation.mutate(user.id)}
                        className="px-3 py-1 text-xs bg-error/10 text-error rounded hover:bg-error/20"
                        disabled={disableMutation.isPending}
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={() => enableMutation.mutate(user.id)}
                        className="px-3 py-1 text-xs bg-success/10 text-success rounded hover:bg-success/20"
                        disabled={enableMutation.isPending}
                      >
                        Enable
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(user.id)}
                      className="px-3 py-1 text-xs bg-error/10 text-error rounded hover:bg-error/20"
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-surface border border-border rounded-lg text-text-primary disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-surface border border-border rounded-lg text-text-primary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}