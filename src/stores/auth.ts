import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Rehydrate from localStorage on store init
  const storedToken = localStorage.getItem('luxe_token')
  const storedUser = localStorage.getItem('luxe_user')
  if (storedToken && storedUser) {
    token.value = storedToken
    try {
      user.value = JSON.parse(storedUser) as AuthUser
    } catch {
      localStorage.removeItem('luxe_user')
    }
  }

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )

  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credentials, expiresInMins: 60 }),
      })

      if (!res.ok) {
        const data: { message: string } = await res.json()
        error.value = data.message || 'Invalid credentials'
        return false
      }

      const data: AuthUser = await res.json()
      user.value = data
      token.value = data.token

      localStorage.setItem('luxe_token', data.token)
      localStorage.setItem('luxe_user', JSON.stringify(data))
      return true
    } catch {
      error.value = 'Network error. Please try again.'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    user.value = null
    token.value = null
    localStorage.removeItem('luxe_token')
    localStorage.removeItem('luxe_user')
  }

  return { user, token, loading, error, isLoggedIn, fullName, login, logout }
})
