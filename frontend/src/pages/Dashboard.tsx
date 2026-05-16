import { useQuery } from '@tanstack/react-query'
import { getAnalytics } from '../lib/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Users', value: data?.total_users ?? 0 },
    { label: 'Active Users', value: data?.active_users ?? 0, color: 'text-success' },
    { label: 'Inactive Users', value: data?.inactive_users ?? 0, color: 'text-error' },
    { label: 'New Today', value: data?.new_users_today ?? 0 },
    { label: 'New This Week', value: data?.new_users_week ?? 0 },
    { label: 'New This Month', value: data?.new_users_month ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-muted">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 bg-surface rounded-xl border border-border"
          >
            <div className="text-text-muted text-sm">{stat.label}</div>
            <div className={`text-3xl font-bold mt-1 ${stat.color || 'text-text-primary'}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-surface rounded-xl border border-border">
        <h2 className="text-lg font-semibold text-text-primary mb-4">User Growth</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[]}>
              <XAxis dataKey="name" stroke="#8B92B5" />
              <YAxis stroke="#8B92B5" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#151934',
                  border: '1px solid #2A2F4A',
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#0066FF"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}