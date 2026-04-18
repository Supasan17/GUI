<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '@/types'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{ item: CartItem }>()
const cart = useCartStore()

const finalPrice = computed(() =>
  props.item.product.price * (1 - props.item.product.discountPercentage / 100)
)
const lineTotal = computed(() => finalPrice.value * props.item.quantity)

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}
</script>

<template>
  <div class="flex gap-4 py-4 animate-fade-in">
    <RouterLink :to="`/product/${item.product.id}`" class="flex-shrink-0">
      <img
        :src="item.product.thumbnail"
        :alt="item.product.title"
        class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-neutral-100 dark:bg-neutral-800"
      />
    </RouterLink>

    <div class="flex-1 min-w-0 flex flex-col gap-1">
      <p class="text-xs font-mono text-neutral-400 uppercase tracking-wider">{{ item.product.brand }}</p>
      <RouterLink :to="`/product/${item.product.id}`" class="font-medium text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 hover:text-brand-500 transition-colors">
        {{ item.product.title }}
      </RouterLink>

      <div class="flex items-center gap-2 mt-auto">
        <span class="font-display font-semibold text-neutral-900 dark:text-white">{{ fmt(lineTotal) }}</span>
        <span v-if="item.product.discountPercentage > 0" class="text-xs text-neutral-400 line-through font-mono">
          {{ fmt(item.product.price * item.quantity) }}
        </span>
      </div>
    </div>

    <!-- Quantity & Remove -->
    <div class="flex flex-col items-end gap-2">
      <button @click="cart.removeFromCart(item.product.id)" class="text-neutral-300 hover:text-red-400 transition-colors" aria-label="Remove item">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>

      <div class="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-full p-1">
        <button
          @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
          class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-neutral-700 transition-colors text-sm font-medium"
          :disabled="item.quantity <= 1"
        >−</button>
        <span class="w-6 text-center text-sm font-mono font-medium">{{ item.quantity }}</span>
        <button
          @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
          class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-neutral-700 transition-colors text-sm font-medium"
          :disabled="item.quantity >= item.product.stock"
        >+</button>
      </div>
    </div>
  </div>
</template>
