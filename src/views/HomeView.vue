<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProducts } from '@/composables/useProducts'
import ProductCard from '@/components/ProductCard.vue'
import FilterBar from '@/components/FilterBar.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import type { ProductFilters } from '@/types'

const {
  filteredProducts,
  categories,
  loading,
  error,
  filters,
  fetchProducts,
  fetchCategories,
  resetFilters,
} = useProducts()

const sidebarOpen = ref(false)

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchProducts()])
})

function updateFilters(updated: ProductFilters): void {
  filters.value = updated
}

const heroProduct = computed(() =>
  filteredProducts.value.find((p) => p.rating >= 4.8) ?? filteredProducts.value[0]
)

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Hero Banner -->
    <section v-if="!loading && heroProduct" class="mb-10 rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-brand-950 dark:to-neutral-900 relative animate-fade-in">
      <div class="absolute inset-0 opacity-20">
        <img :src="heroProduct.images[0]" :alt="heroProduct.title" class="w-full h-full object-cover" />
      </div>
      <div class="relative z-10 flex flex-col sm:flex-row items-center gap-6 p-8 sm:p-12">
        <div class="flex-1 text-center sm:text-left">
          <span class="badge bg-brand-500 text-white mb-3 inline-block">New Arrival</span>
          <h1 class="font-display font-bold text-3xl sm:text-4xl text-white leading-tight mb-2">
            {{ heroProduct.title }}
          </h1>
          <p class="text-neutral-300 text-sm line-clamp-2 mb-5 max-w-md">{{ heroProduct.description }}</p>
          <RouterLink :to="`/product/${heroProduct.id}`" class="btn-primary">
            Shop Now — {{ formatPrice(heroProduct.price * (1 - heroProduct.discountPercentage / 100)) }}
          </RouterLink>
        </div>
        <img :src="heroProduct.thumbnail" :alt="heroProduct.title" class="w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-2xl shadow-2xl ring-4 ring-white/10 flex-shrink-0" />
      </div>
    </section>

    <div class="flex gap-8">
      <!-- Sidebar Filter (desktop) -->
      <aside class="hidden lg:block w-72 flex-shrink-0">
        <div class="sticky top-24">
          <FilterBar
            :filters="filters"
            :categories="categories"
            :total-results="filteredProducts.length"
            @update:filters="updateFilters"
            @reset="resetFilters"
          />
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">

        <!-- Mobile filter toggle -->
        <div class="flex items-center justify-between mb-5 lg:hidden">
          <h2 class="font-display font-semibold text-xl">Products</h2>
          <button @click="sidebarOpen = true" class="btn-outline text-sm gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
            </svg>
            Filters
          </button>
        </div>

        <!-- Desktop heading -->
        <div class="hidden lg:flex items-center justify-between mb-5">
          <h2 class="font-display font-semibold text-xl">
            {{ filters.category ? filters.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'All Products' }}
          </h2>
          <span class="text-sm font-mono text-neutral-400">{{ filteredProducts.length }} items</span>
        </div>

        <!-- Error -->
        <div v-if="error" class="card p-8 text-center text-red-500">
          <p class="font-medium">{{ error }}</p>
          <button @click="fetchProducts" class="btn-outline mt-4">Try Again</button>
        </div>

        <!-- Loading Skeletons -->
        <div v-else-if="loading" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <SkeletonCard v-for="n in 12" :key="n" />
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProducts.length === 0" class="card p-12 text-center animate-fade-in">
          <p class="text-4xl mb-3">🔍</p>
          <p class="font-display font-semibold text-lg mb-1">No products found</p>
          <p class="text-sm text-neutral-400 mb-5">Try adjusting your filters or search terms.</p>
          <button @click="resetFilters" class="btn-primary">Clear Filters</button>
        </div>

        <!-- Product Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Filter Drawer -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="sidebarOpen" class="fixed inset-0 z-50 lg:hidden">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="sidebarOpen = false"></div>
          <div class="absolute right-0 top-0 bottom-0 w-80 bg-surface dark:bg-surface-dark p-5 overflow-y-auto shadow-2xl animate-slide-up">
            <div class="flex items-center justify-between mb-5">
              <h3 class="font-display font-semibold text-lg">Filters</h3>
              <button @click="sidebarOpen = false" class="btn-ghost p-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <FilterBar
              :filters="filters"
              :categories="categories"
              :total-results="filteredProducts.length"
              @update:filters="updateFilters"
              @reset="() => { resetFilters(); sidebarOpen = false }"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<style scoped>
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.3s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
</style>
