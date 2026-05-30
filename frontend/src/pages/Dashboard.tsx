import { useQuery } from '@tanstack/react-query'
import { getAnalytics, getActivity, getLogins } from '../lib/api'
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'

export default function Dashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  })

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['activity'],
    queryFn: getActivity,
  })

  const { data: loginData, isLoading: loginsLoading } = useQuery({
    queryKey: ['logins'],
    queryFn: () => getLogins({ page: 1, per_page: 5 }),
  })

  if (analyticsLoading || activityLoading || loginsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted animate-pulse">Loading dashboard data...</div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Users', value: analytics?.total_users ?? 0, trend: 'platform' },
    { label: 'Active Users', value: analytics?.active_users ?? 0, color: 'text-success' },
    { label: 'Platform Tasks', value: analytics?.total_tasks ?? 0, color: 'text-primary' },
    { label: 'New Today', value: analytics?.new_users_today ?? 0 },
    { label: 'New This Week', value: analytics?.new_users_week ?? 0 },
    { label: 'Completion Rate', value: `${analytics?.total_tasks ? Math.round((analytics.completed_tasks / analytics.total_tasks) * 100) : 0}%`, color: 'text-warning' },
  ]

  const COLORS = ['#10B981', '#EF4444']
  const distributionData = [
    { name: 'Active', value: analytics?.active_users ?? 0 },
    { name: 'Inactive', value: analytics?.inactive_users ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-muted text-sm">Real-time platform performance metrics</p>
        </div>
        <div className="text-xs text-text-muted bg-surface px-3 py-1 rounded-full border border-border">
          Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 bg-surface rounded-xl border border-border shadow-sm hover:border-primary/30 transition-colors"
          >
            <div className="text-text-muted text-xs uppercase font-bold tracking-wider">{stat.label}</div>
            <div className={`text-3xl font-bold mt-1 ${stat.color || 'text-text-primary'}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-surface rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-6">Registration Activity</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData?.activity || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#8B92B5" 
                    tickFormatter={(str) => {
                      const date = new Date(str)
                      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                    }}
                    fontSize={12}
                  />
                  <YAxis stroke="#8B92B5" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151934',
                      border: '1px solid #2A2F4A',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="New Users"
                    stroke="#0066FF"
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 bg-surface rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Access Log</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-text-muted text-xs uppercase tracking-wider border-b border-border">
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loginData?.logins.map((login) => (
                    <tr key={login.id} className="text-sm">
                      <td className="py-3 text-text-primary">{login.email}</td>
                      <td className="py-3 text-text-muted text-right">
                        {new Date(login.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                  {(!loginData?.logins || loginData.logins.length === 0) && (
                    <tr>
                      <td colSpan={2} className="py-6 text-center text-text-muted italic">
                        No recent access records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface rounded-xl border border-border shadow-sm flex flex-col h-fit sticky top-6">
          <h2 className="text-lg font-semibold text-text-primary mb-6">User Status</h2>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{
                    backgroundColor: '#151934',
                    border: '1px solid #2A2F4A',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-sm text-text-muted">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error"></div>
              <span className="text-sm text-text-muted">Inactive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}