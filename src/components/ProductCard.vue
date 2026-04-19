<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'

const props = defineProps<{ product: Product }>()

const cart = useCartStore()
const ui = useUIStore()

const discountedPrice = computed(() =>
  props.product.price * (1 - props.product.discountPercentage / 100)
)

const inCart = computed(() => cart.isInCart(props.product.id))

function handleAddToCart(e: Event): void {
  e.preventDefault()
  e.stopPropagation()
  cart.addToCart(props.product)
  ui.showToast(`"${props.product.title}" added to cart`, 'success')
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

function getRatingStars(rating: number): string {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
}
</script>

<template>
  <RouterLink :to="`/product/${product.id}`" class="card group flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in">
    <!-- Image -->
    <div class="relative overflow-hidden bg-neutral-50 dark:bg-neutral-800 aspect-square">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <!-- Discount Badge -->
      <span v-if="product.discountPercentage > 0"
        class="badge absolute top-3 left-3 bg-brand-500 text-white">
        -{{ Math.round(product.discountPercentage) }}%
      </span>
      <!-- Stock Badge -->
      <span v-if="product.stock < 10"
        class="badge absolute top-3 right-3 bg-amber-500 text-white">
        {{ product.stock }} left
      </span>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-4 gap-2">
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <p class="text-xs font-mono text-neutral-400 uppercase tracking-wider truncate">{{ product.brand }}</p>
          <h3 class="font-body font-medium text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug mt-0.5">
            {{ product.title }}
          </h3>
        </div>
      </div>

      <!-- Rating -->
      <div class="flex items-center gap-1.5">
        <span class="text-amber-400 text-xs tracking-tighter">{{ getRatingStars(product.rating) }}</span>
        <span class="text-xs text-neutral-400 font-mono">{{ product.rating.toFixed(1) }}</span>
      </div>

      <!-- Price -->
      <div class="flex items-baseline gap-2 mt-auto pt-2">
        <span class="font-display font-semibold text-lg text-neutral-900 dark:text-white">
          {{ formatPrice(discountedPrice) }}
        </span>
        <span v-if="product.discountPercentage > 0" class="text-sm text-neutral-400 line-through font-mono">
          {{ formatPrice(product.price) }}
        </span>
      </div>

      <!-- Add to Cart -->
      <button
        @click="handleAddToCart"
        :class="inCart ? 'btn-outline' : 'btn-primary'"
        class="w-full justify-center text-sm mt-1"
      >
        <svg v-if="!inCart" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ inCart ? 'In Cart' : 'Add to Cart' }}
      </button>
    </div>
  </RouterLink>
</template>
