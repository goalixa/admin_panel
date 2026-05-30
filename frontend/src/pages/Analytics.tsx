import { useQuery } from '@tanstack/react-query'
import { getAnalytics, getTaskAnalytics } from '../lib/api'
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, CartesianGrid 
} from 'recharts'

export default function Analytics() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  })

  const { data: taskData, isLoading: taskLoading } = useQuery({
    queryKey: ['task-analytics'],
    queryFn: getTaskAnalytics,
  })

  if (analyticsLoading || taskLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted animate-pulse">Loading detailed analytics...</div>
      </div>
    )
  }

  const userStatsData = [
    { name: 'Today', users: analytics?.new_users_today ?? 0 },
    { name: 'This Week', users: analytics?.new_users_week ?? 0 },
    { name: 'This Month', users: analytics?.new_users_month ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="text-text-muted">Platform-wide statistics and activity trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-surface rounded-xl border border-border shadow-sm">
          <div className="text-sm text-text-muted mb-1 font-medium">Total Tasks</div>
          <div className="text-3xl font-bold text-text-primary">{analytics?.total_tasks ?? 0}</div>
          <div className="mt-2 text-xs text-success font-semibold">
            {analytics?.completed_tasks ?? 0} completed
          </div>
        </div>
        <div className="p-6 bg-surface rounded-xl border border-border shadow-sm">
          <div className="text-sm text-text-muted mb-1 font-medium">Total Projects</div>
          <div className="text-3xl font-bold text-text-primary">{analytics?.total_projects ?? 0}</div>
        </div>
        <div className="p-6 bg-surface rounded-xl border border-border shadow-sm">
          <div className="text-sm text-text-muted mb-1 font-medium">Active Users</div>
          <div className="text-3xl font-bold text-success">{analytics?.active_users ?? 0}</div>
          <div className="mt-2 text-xs text-text-muted italic">
            {(analytics?.total_users ? Math.round((analytics.active_users / analytics.total_users) * 100) : 0)}% of total
          </div>
        </div>
        <div className="p-6 bg-surface rounded-xl border border-border shadow-sm">
          <div className="text-sm text-text-muted mb-1 font-medium">Completion Rate</div>
          <div className="text-3xl font-bold text-warning">
            {analytics?.total_tasks ? Math.round((analytics.completed_tasks / analytics.total_tasks) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-surface rounded-xl border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Task Activity (Last 30 Days)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData?.task_activity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F4A" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#8B92B5" 
                  fontSize={12}
                  tickFormatter={(str) => {
                    const date = new Date(str)
                    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                  }}
                />
                <YAxis stroke="#8B92B5" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151934',
                    border: '1px solid #2A2F4A',
                    borderRadius: '8px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="created" name="Tasks Created" fill="#0066FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Tasks Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-surface rounded-xl border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Registration Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userStatsData}>
                <XAxis dataKey="name" stroke="#8B92B5" fontSize={12} />
                <YAxis stroke="#8B92B5" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151934',
                    border: '1px solid #2A2F4A',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="users" name="New Users" fill="#0066FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}