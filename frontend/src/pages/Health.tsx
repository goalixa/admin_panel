import { useQuery } from '@tanstack/react-query'
import { getHealth } from '../lib/api'

export default function Health() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 30000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    healthy: 'bg-success',
    degraded: 'bg-warning',
    down: 'bg-error',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Health</h1>
          <p className="text-text-muted">System status</p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
        >
          Refresh
        </button>
      </div>

      <div className="p-6 bg-surface rounded-xl border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-4 h-4 rounded-full ${
              data?.status === 'healthy'
                ? 'bg-success'
                : data?.status === 'degraded'
                ? 'bg-warning'
                : 'bg-error'
            }`}
          />
          <span className="text-lg font-semibold text-text-primary capitalize">
            {data?.status || 'Unknown'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.services.map((service) => (
            <div
              key={service.name}
              className="p-4 bg-background rounded-lg border border-border"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary capitalize">
                  {service.name}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      service.status === 'healthy'
                        ? 'bg-success'
                        : service.status === 'degraded'
                        ? 'bg-warning'
                        : 'bg-error'
                    }`}
                  />
                  <span className="text-sm text-text-muted capitalize">
                    {service.status}
                  </span>
                </div>
              </div>
              {service.latency_ms > 0 && (
                <div className="mt-2 text-sm text-text-muted">
                  Latency: {service.latency_ms}ms
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}