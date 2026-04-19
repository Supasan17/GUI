<script setup lang="ts">
import type { ProductFilters, SortOption } from '@/types'

const props = defineProps<{
  filters: ProductFilters
  categories: string[]
  totalResults: number
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: ProductFilters): void
  (e: 'reset'): void
}>()

function update<K extends keyof ProductFilters>(key: K, value: ProductFilters[K]): void {
  emit('update:filters', { ...props.filters, [key]: value })
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' },
]

function formatCategory(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
</script>

<template>
  <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 space-y-5">
    <!-- Search -->
    <div class="relative">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
      </svg>
      <input
        :value="filters.search"
        @input="update('search', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Search products…"
        class="input pl-9"
      />
    </div>

    <!-- Category -->
    <div>
      <label class="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">Category</label>
      <div class="flex flex-wrap gap-1.5">
        <button
          @click="update('category', '')"
          :class="['badge cursor-pointer transition-colors', filters.category === '' ? 'bg-brand-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-brand-50 dark:hover:bg-neutral-700']"
        >All</button>
        <button
          v-for="cat in categories"
          :key="cat"
          @click="update('category', cat)"
          :class="['badge cursor-pointer transition-colors capitalize', filters.category === cat ? 'bg-brand-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-brand-50 dark:hover:bg-neutral-700']"
        >{{ formatCategory(cat) }}</button>
      </div>
    </div>

    <!-- Sort -->
    <div>
      <label class="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">Sort By</label>
      <select
        :value="filters.sortBy"
        @change="update('sortBy', ($event.target as HTMLSelectElement).value as SortOption)"
        class="input"
      >
        <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </div>

    <!-- Price Range -->
    <div>
      <label class="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
        Max Price: <span class="text-brand-500">${{ filters.maxPrice }}</span>
      </label>
      <input
        type="range"
        :value="filters.maxPrice"
        @input="update('maxPrice', Number(($event.target as HTMLInputElement).value))"
        min="0"
        max="10000"
        step="50"
        class="w-full accent-brand-500"
      />
      <div class="flex justify-between text-xs font-mono text-neutral-400 mt-1">
        <span>$0</span><span>$10,000</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
      <span class="text-xs font-mono text-neutral-400">{{ totalResults }} results</span>
      <button @click="$emit('reset')" class="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">Reset filters</button>
    </div>
  </div>
</template>
