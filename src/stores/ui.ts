import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast, ToastType } from '@/types'

export const useUIStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const isDarkMode = ref(false)
  let nextId = 0

  // Rehydrate dark mode
  const stored = localStorage.getItem('luxe_dark')
  if (stored === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }

  function toggleDarkMode(): void {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.classList.toggle('dark', isDarkMode.value)
    localStorage.setItem('luxe_dark', String(isDarkMode.value))
  }

  function showToast(message: string, type: ToastType = 'info'): void {
    const id = ++nextId
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 3500)
  }

  function dismissToast(id: number): void {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, isDarkMode, toggleDarkMode, showToast, dismissToast }
})
