<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProduct } from '@/composables/useProduct'
import { useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'
import StarRating from '@/components/StarRating.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'

const props = defineProps<{ id: string }>()

const { product, loading, error, fetchProduct } = useProduct()
const cart = useCartStore()
const ui = useUIStore()

const selectedImage = ref(0)
const quantity = ref(1)

onMounted(() => fetchProduct(Number(props.id)))

const inCart = computed(() => product.value ? cart.isInCart(product.value.id) : false)
const discountedPrice = computed(() =>
  product.value ? product.value.price * (1 - product.value.discountPercentage / 100) : 0
)

function addToCart(): void {
  if (!product.value) return
  cart.addToCart(product.value, quantity.value)
  ui.showToast(`${quantity.value}× "${product.value.title}" added to cart`, 'success')
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-neutral-400 mb-6 font-mono">
      <RouterLink to="/" class="hover:text-brand-500 transition-colors">Shop</RouterLink>
      <span>/</span>
      <span v-if="product" class="text-neutral-700 dark:text-neutral-300 capitalize">{{ product.category }}</span>
      <span v-if="product">/</span>
      <span v-if="product" class="text-neutral-700 dark:text-neutral-300 truncate max-w-xs">{{ product.title }}</span>
    </nav>

    <!-- Skeleton -->
    <div v-if="loading" class="grid lg:grid-cols-2 gap-10">
      <div class="space-y-3">
        <div class="aspect-square shimmer rounded-2xl"></div>
        <div class="flex gap-2">
          <div v-for="n in 4" :key="n" class="w-16 h-16 shimmer rounded-xl"></div>
        </div>
      </div>
      <div class="space-y-4 pt-4">
        <div class="h-6 shimmer rounded-full w-1/4"></div>
        <div class="h-8 shimmer rounded-full w-3/4"></div>
        <div class="h-4 shimmer rounded-full w-1/2"></div>
        <div class="h-24 shimmer rounded-2xl"></div>
        <div class="h-10 shimmer rounded-full"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card p-12 text-center">
      <p class="text-red-500 font-medium mb-4">{{ error }}</p>
      <RouterLink to="/" class="btn-outline">Back to Shop</RouterLink>
    </div>

    <!-- Product Detail -->
    <template v-else-if="product">
      <div class="grid lg:grid-cols-2 gap-10 animate-fade-in">

        <!-- Images -->
        <div class="space-y-3">
          <div class="aspect-square bg-neutral-50 dark:bg-neutral-800 rounded-2xl overflow-hidden">
            <img
              :src="product.images[selectedImage]"
              :alt="product.title"
              class="w-full h-full object-cover animate-scale-in"
              :key="selectedImage"
            />
          </div>
          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="(img, i) in product.images"
              :key="i"
              @click="selectedImage = i"
              :class="['w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-2 transition-all', i === selectedImage ? 'ring-brand-500' : 'ring-transparent hover:ring-neutral-300']"
            >
              <img :src="img" :alt="`View ${i + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-5">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="badge bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 capitalize">{{ product.category }}</span>
              <span v-if="product.availabilityStatus === 'In Stock'" class="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">In Stock</span>
              <span v-else class="badge bg-amber-100 text-amber-700">{{ product.availabilityStatus }}</span>
            </div>
            <h1 class="font-display font-bold text-3xl text-neutral-900 dark:text-white leading-tight">{{ product.title }}</h1>
            <p class="text-sm font-mono text-neutral-400 mt-1">by {{ product.brand }} · SKU: {{ product.sku }}</p>
          </div>

          <StarRating :rating="product.rating" :count="product.reviews.length" />

          <!-- Price -->
          <div class="flex items-baseline gap-3">
            <span class="font-display font-bold text-4xl text-neutral-900 dark:text-white">{{ fmt(discountedPrice) }}</span>
            <span v-if="product.discountPercentage > 0" class="font-mono text-lg text-neutral-400 line-through">{{ fmt(product.price) }}</span>
            <span v-if="product.discountPercentage > 0" class="badge bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
              Save {{ Math.round(product.discountPercentage) }}%
            </span>
          </div>

          <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">{{ product.description }}</p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5">
            <span v-for="tag in product.tags" :key="tag" class="badge bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 capitalize">
              #{{ tag }}
            </span>
          </div>

          <!-- Quantity + Add to Cart -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-full p-1">
              <button @click="quantity = Math.max(1, quantity - 1)" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium text-lg">−</button>
              <span class="w-10 text-center font-mono font-medium">{{ quantity }}</span>
              <button @click="quantity = Math.min(product.stock, quantity + 1)" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium text-lg">+</button>
            </div>
            <button @click="addToCart" :class="inCart ? 'btn-outline flex-1' : 'btn-primary flex-1'" class="justify-center">
              <svg v-if="!inCart" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {{ inCart ? '✓ Added to Cart' : 'Add to Cart' }}
            </button>
          </div>

          <!-- Meta Details -->
          <div class="card p-4 space-y-2 text-sm">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <p class="text-xs font-mono text-neutral-400 uppercase tracking-wider">Shipping</p>
                <p class="text-neutral-700 dark:text-neutral-300 mt-0.5">{{ product.shippingInformation }}</p>
              </div>
              <div>
                <p class="text-xs font-mono text-neutral-400 uppercase tracking-wider">Warranty</p>
                <p class="text-neutral-700 dark:text-neutral-300 mt-0.5">{{ product.warrantyInformation }}</p>
              </div>
              <div>
                <p class="text-xs font-mono text-neutral-400 uppercase tracking-wider">Returns</p>
                <p class="text-neutral-700 dark:text-neutral-300 mt-0.5">{{ product.returnPolicy }}</p>
              </div>
              <div>
                <p class="text-xs font-mono text-neutral-400 uppercase tracking-wider">Min. Order</p>
                <p class="text-neutral-700 dark:text-neutral-300 mt-0.5">{{ product.minimumOrderQuantity }} unit(s)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <section class="mt-14">
        <h2 class="font-display font-bold text-2xl mb-6">Customer Reviews</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(review, i) in product.reviews"
            :key="i"
            class="card p-5 space-y-3 animate-slide-up"
            :style="{ animationDelay: `${i * 0.05}s` }"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="font-medium text-sm text-neutral-900 dark:text-neutral-100">{{ review.reviewerName }}</p>
                <p class="text-xs font-mono text-neutral-400">{{ formatDate(review.date) }}</p>
              </div>
              <div class="flex text-amber-400 text-sm">
                <span v-for="n in 5" :key="n">{{ n <= review.rating ? '★' : '☆' }}</span>
              </div>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{{ review.comment }}</p>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>
