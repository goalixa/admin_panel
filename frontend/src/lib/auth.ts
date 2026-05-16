import { login as apiLogin } from './api'
import { useAuthStore } from '../stores/auth'

export async function login(email: string, password: string) {
  const response = await apiLogin(email, password)
  useAuthStore.getState().login(response.access_token, response.user)
  return response
}

export function logout() {
  useAuthStore.getState().logout()
}