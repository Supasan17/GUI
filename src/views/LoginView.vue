<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const ui = useUIStore()

const form = reactive({ username: '', password: '' })
const showPassword = ref(false)

// Pre-fill demo credentials
function fillDemo(): void {
  form.username = 'emilys'
  form.password = 'emilyspass'
}

async function handleSubmit(): Promise<void> {
  if (!form.username || !form.password) {
    ui.showToast('Please fill in all fields', 'error')
    return
  }

  const success = await auth.login({ username: form.username, password: form.password })

  if (success) {
    ui.showToast(`Welcome back, ${auth.fullName}! 👋`, 'success')
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? '/')
  } else {
    ui.showToast(auth.error ?? 'Login failed', 'error')
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md animate-slide-up">

      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="font-display font-bold text-3xl mb-2">Welcome back</h1>
        <p class="text-neutral-500 text-sm">Sign in to access your cart and orders</p>
      </div>

      <!-- Card -->
      <div class="card p-8 space-y-5">

        <!-- Demo Hint -->
        <div class="rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 p-4 flex items-start gap-3">
          <span class="text-brand-500 mt-0.5">ℹ</span>
          <div class="text-sm text-brand-700 dark:text-brand-300">
            <p class="font-medium mb-1">Demo Account</p>
            <p class="text-brand-600/80 dark:text-brand-400/80 text-xs">Username: <code class="font-mono">emilys</code> · Password: <code class="font-mono">emilyspass</code></p>
            <button @click="fillDemo" class="mt-2 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">Click to auto-fill →</button>
          </div>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Username</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="e.g. emilys"
              class="input"
              @keydown.enter="handleSubmit"
              autocomplete="username"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Your password"
                class="input pr-10"
                @keydown.enter="handleSubmit"
                autocomplete="current-password"
              />
              <button
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                type="button"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.68 1.67-1.2 2.4"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.025 10.025 0 012.816-4.432M6.1 6.1A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.03 10.03 0 01-4.434 5.568M3 3l18 18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Error -->
        <p v-if="auth.error" class="text-sm text-red-500 text-center">{{ auth.error }}</p>

        <!-- Submit -->
        <button
          @click="handleSubmit"
          :disabled="auth.loading"
          class="btn-primary w-full justify-center"
        >
          <svg v-if="auth.loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ auth.loading ? 'Signing in…' : 'Sign In' }}
        </button>

        <p class="text-center text-sm text-neutral-500">
          Powered by
          <a href="https://dummyjson.com" target="_blank" class="text-brand-500 hover:underline">DummyJSON API</a>
        </p>
      </div>

      <p class="text-center text-sm text-neutral-400 mt-4">
        <RouterLink to="/" class="hover:text-brand-500 transition-colors">← Back to shop</RouterLink>
      </p>
    </div>
  </main>
</template>
