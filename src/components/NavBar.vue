<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const ui = useUIStore()

const mobileMenuOpen = ref(false)

const itemCount = computed(() => cart.summary.itemCount)

function goToCart(): void {
  mobileMenuOpen.value = false
  if (!auth.isLoggedIn) {
    router.push({ name: 'login', query: { redirect: '/cart' } })
  } else {
    router.push({ name: 'cart' })
  }
}

function handleLogout(): void {
  auth.logout()
  ui.showToast('Logged out successfully', 'info')
  router.push('/')
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <span class="font-display font-bold text-2xl text-neutral-900 dark:text-white tracking-tight group-hover:text-brand-500 transition-colors">LUXE</span>
          <span class="hidden sm:block w-1.5 h-1.5 rounded-full bg-brand-500"></span>
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink to="/" :class="['btn-ghost text-sm', route.name === 'home' ? 'text-brand-500' : '']">
            Shop
          </RouterLink>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2">
          <!-- Dark Mode -->
          <button @click="ui.toggleDarkMode()" class="btn-ghost p-2" :aria-label="ui.isDarkMode ? 'Light mode' : 'Dark mode'">
            <svg v-if="!ui.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m8.66-9H20M4 12H3m15.07-6.07l-.71.71M6.64 17.36l-.71.71M17.36 17.36l.71.71M6.64 6.64l.71.71M12 5a7 7 0 100 14A7 7 0 0012 5z"/>
            </svg>
          </button>

          <!-- Cart -->
          <button @click="goToCart" class="relative btn-ghost p-2" aria-label="Shopping cart">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span v-if="itemCount > 0"
              class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-xs font-mono rounded-full flex items-center justify-center animate-scale-in">
              {{ itemCount > 9 ? '9+' : itemCount }}
            </span>
          </button>

          <!-- Auth -->
          <div class="hidden md:flex items-center gap-2">
            <template v-if="auth.isLoggedIn">
              <div class="flex items-center gap-2">
                <img :src="auth.user?.image" :alt="auth.fullName" class="w-8 h-8 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800" />
                <button @click="handleLogout" class="btn-outline text-xs py-1.5 px-3">Log out</button>
              </div>
            </template>
            <RouterLink v-else to="/login" class="btn-primary text-sm py-2 px-4">Sign in</RouterLink>
          </div>

          <!-- Mobile Menu Toggle -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden btn-ghost p-2">
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-neutral-100 dark:border-neutral-800 animate-fade-in">
        <div class="flex flex-col gap-2">
          <RouterLink to="/" @click="mobileMenuOpen = false" class="btn-ghost justify-start">Shop</RouterLink>
          <template v-if="auth.isLoggedIn">
            <div class="flex items-center gap-3 px-3 py-2">
              <img :src="auth.user?.image" :alt="auth.fullName" class="w-8 h-8 rounded-full object-cover" />
              <span class="text-sm font-medium">{{ auth.fullName }}</span>
            </div>
            <button @click="handleLogout" class="btn-ghost justify-start text-red-500">Log out</button>
          </template>
          <RouterLink v-else to="/login" @click="mobileMenuOpen = false" class="btn-primary justify-center">Sign in</RouterLink>
        </div>
      </div>
    </nav>
  </header>
</template>
