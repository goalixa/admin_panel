import { create } from 'zustand'

interface User {
  id: number
  email: string
  role: string
}

interface AuthState {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('admin_token'),
  user: null,
  login: (token, user) => {
    localStorage.setItem('admin_token', token)
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('admin_token')
    set({ token: null, user: null })
  },
}))