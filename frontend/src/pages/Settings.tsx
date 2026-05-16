import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSettings, updateSettings } from '../lib/api'

export default function Settings() {
  const queryClient = useQueryClient()
  const [siteName, setSiteName] = useState('')
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [requireEmailVerification, setRequireEmailVerification] = useState(true)

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  })

  useEffect(() => {
    if (data) {
      setSiteName((data as Record<string, unknown>).site_name as string || 'Goalixa')
      setAllowRegistration(
        (data as Record<string, unknown>).allow_registration as boolean ?? true
      )
      setRequireEmailVerification(
        (data as Record<string, unknown>).require_email_verification as boolean ?? true
      )
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  })

  const handleSave = () => {
    updateMutation.mutate({
      site_name: siteName,
      allow_registration: allowRegistration,
      require_email_verification: requireEmailVerification,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-muted">Configure system settings</p>
      </div>

      <div className="p-6 bg-surface rounded-xl border border-border space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-text-primary">Allow Registration</div>
            <div className="text-sm text-text-muted">
              Allow new users to register
            </div>
          </div>
          <button
            onClick={() => setAllowRegistration(!allowRegistration)}
            className={`w-12 h-6 rounded-full transition-colors ${
              allowRegistration ? 'bg-primary' : 'bg-border'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                allowRegistration ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-text-primary">Require Email Verification</div>
            <div className="text-sm text-text-muted">
              Require email verification before account activation
            </div>
          </div>
          <button
            onClick={() => setRequireEmailVerification(!requireEmailVerification)}
            className={`w-12 h-6 rounded-full transition-colors ${
              requireEmailVerification ? 'bg-primary' : 'bg-border'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                requireEmailVerification ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}