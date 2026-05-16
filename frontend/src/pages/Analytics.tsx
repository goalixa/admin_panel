import { useQuery } from '@tanstack/react-query'
import { getAnalytics } from '../lib/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function Analytics() {
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

  const chartData = [
    { name: 'Today', users: data?.new_users_today ?? 0 },
    { name: 'Week', users: data?.new_users_week ?? 0 },
    { name: 'Month', users: data?.new_users_month ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="text-text-muted">User statistics and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-surface rounded-xl border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            New Users by Period
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#8B92B5" />
                <YAxis stroke="#8B92B5" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151934',
                    border: '1px solid #2A2F4A',
                  }}
                />
                <Bar dataKey="users" fill="#0066FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-surface rounded-xl border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            User Distribution
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">Active</span>
                <span className="text-text-primary">{data?.active_users ?? 0}</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-success"
                  style={{
                    width: `${((data?.active_users ?? 0) / (data?.total_users ?? 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">Inactive</span>
                <span className="text-text-primary">
                  {data?.inactive_users ?? 0}
                </span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-error"
                  style={{
                    width: `${((data?.inactive_users ?? 0) / (data?.total_users ?? 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}