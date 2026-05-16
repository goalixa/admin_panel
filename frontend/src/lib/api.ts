const API_BASE = '/admin/api'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('admin_token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || 'Request failed')
  }

  return response.json()
}

export interface User {
  id: number
  email: string
  active: boolean
  email_verified: boolean
  created_at: string
  last_login?: string
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  per_page: number
}

export interface Analytics {
  total_users: number
  active_users: number
  inactive_users: number
  new_users_today: number
  new_users_week: number
  new_users_month: number
}

export interface ServiceHealth {
  name: string
  status: string
  latency_ms: number
}

export interface HealthResponse {
  status: string
  services: ServiceHealth[]
}

export function getUsers(params?: { page?: number; per_page?: number }) {
  const query = new URLSearchParams(params as Record<string, string>)
  return apiRequest<UsersResponse>(`/users?${query}`)
}

export function getUser(id: number) {
  return apiRequest<User>(`/users/${id}`)
}

export function disableUser(id: number) {
  return apiRequest<{ message: string }>(`/users/${id}/disable`, { method: 'POST' })
}

export function enableUser(id: number) {
  return apiRequest<{ message: string }>(`/users/${id}/enable`, { method: 'POST' })
}

export function deleteUser(id: number) {
  return apiRequest<{ message: string }>(`/users/${id}`, { method: 'DELETE' })
}

export function getAnalytics() {
  return apiRequest<Analytics>('/analytics')
}

export function getHealth() {
  return apiRequest<HealthResponse>('/health')
}

export function getSettings() {
  return apiRequest<Record<string, unknown>('/settings')
}

export function updateSettings(settings: Record<string, unknown>) {
  return apiRequest<Record<string, unknown>('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  })
}

export function login(email: string, password: string) {
  return apiRequest<{ access_token: string; refresh_token: string; user: User }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  )
}