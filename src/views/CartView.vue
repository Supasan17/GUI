<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import CartItemRow from '@/components/CartItemRow.vue'

const cart = useCartStore()
const auth = useAuthStore()
const ui = useUIStore()

const checkingOut = ref(false)

const summary = computed(() => cart.summary)

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

async function checkout(): Promise<void> {
  checkingOut.value = true
  // Simulate checkout process
  await new Promise((res) => setTimeout(res, 1500))
  cart.clearCart()
  ui.showToast('Order placed successfully! 🎉', 'success')
  checkingOut.value = false
}
</script>

<template>
  <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center gap-3 mb-8">
      <RouterLink to="/" class="btn-ghost p-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </RouterLink>
      <h1 class="font-display font-bold text-2xl">Shopping Cart</h1>
      <span class="badge bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono">{{ summary.itemCount }} items</span>
    </div>

    <!-- Empty Cart -->
    <div v-if="summary.items.length === 0" class="card p-16 text-center animate-fade-in">
      <div class="text-6xl mb-4">🛒</div>
      <h2 class="font-display font-semibold text-xl mb-2">Your cart is empty</h2>
      <p class="text-neutral-400 text-sm mb-6">Add some products to get started.</p>
      <RouterLink to="/" class="btn-primary">Continue Shopping</RouterLink>
    </div>

    <!-- Cart Content -->
    <div v-else class="grid lg:grid-cols-3 gap-6 animate-fade-in">

      <!-- Items List -->
      <div class="lg:col-span-2 card divide-y divide-neutral-100 dark:divide-neutral-800 px-5">
        <CartItemRow v-for="item in summary.items" :key="item.product.id" :item="item" />
      </div>

      <!-- Order Summary -->
      <div class="space-y-4">
        <!-- Auth Info -->
        <div class="card p-4 flex items-center gap-3">
          <img :src="auth.user?.image" :alt="auth.fullName" class="w-10 h-10 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800" />
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ auth.fullName }}</p>
            <p class="text-xs font-mono text-neutral-400 truncate">{{ auth.user?.email }}</p>
          </div>
        </div>

        <!-- Summary Card -->
        <div class="card p-5 space-y-3">
          <h2 class="font-display font-semibold text-lg">Order Summary</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-neutral-500">Subtotal</span>
              <span class="font-mono">{{ fmt(summary.subtotal) }}</span>
            </div>
            <div v-if="summary.discount > 0" class="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Discount</span>
              <span class="font-mono">−{{ fmt(summary.discount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-500">Shipping</span>
              <span class="font-mono text-emerald-600 dark:text-emerald-400">Free</span>
            </div>
          </div>
          <div class="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span class="font-display text-xl">{{ fmt(summary.total) }}</span>
          </div>
          <button
            @click="checkout"
            :disabled="checkingOut"
            class="btn-primary w-full justify-center mt-2"
          >
            <svg v-if="checkingOut" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ checkingOut ? 'Processing…' : 'Checkout' }}
          </button>
          <RouterLink to="/" class="btn-ghost w-full justify-center text-sm">Continue Shopping</RouterLink>
        </div>

        <!-- Savings Banner -->
        <div v-if="summary.discount > 0" class="card p-4 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-center">
          <p class="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
            🎉 You're saving {{ fmt(summary.discount) }} on this order!
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
