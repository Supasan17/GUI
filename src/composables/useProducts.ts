import { ref, computed, watch } from 'vue'
import type { Product, ProductsResponse, ProductFilters, SortOption } from '@/types'

const BASE = 'https://dummyjson.com'

export function useProducts() {
  const allProducts = ref<Product[]>([])
  const categories = ref<string[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filters = ref<ProductFilters>({
    search: '',
    category: '',
    sortBy: 'default',
    minPrice: 0,
    maxPrice: 10000,
  })

  async function fetchCategories(): Promise<void> {
    try {
      const res = await fetch(`${BASE}/products/categories`)
      const data: Array<{ slug: string; name: string }> = await res.json()
      categories.value = data.map((c) => c.slug)
    } catch {
      error.value = 'Failed to load categories'
    }
  }

  async function fetchProducts(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      let url = ''
      if (filters.value.search.trim()) {
        url = `${BASE}/products/search?q=${encodeURIComponent(filters.value.search)}&limit=100`
      } else if (filters.value.category) {
        url = `${BASE}/products/category/${filters.value.category}?limit=100`
      } else {
        url = `${BASE}/products?limit=100`
      }

      const res = await fetch(url)
      const data: ProductsResponse = await res.json()
      allProducts.value = data.products
      total.value = data.total
    } catch {
      error.value = 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  const filteredProducts = computed<Product[]>(() => {
    let result = [...allProducts.value]

    // Price filter
    result = result.filter(
      (p) => p.price >= filters.value.minPrice && p.price <= filters.value.maxPrice
    )

    // Sort
    const sort: SortOption = filters.value.sortBy
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    else if (sort === 'name') result.sort((a, b) => a.title.localeCompare(b.title))

    return result
  })

  // Re-fetch when search or category changes
  watch([() => filters.value.search, () => filters.value.category], () => {
    fetchProducts()
  })

  function resetFilters(): void {
    filters.value = { search: '', category: '', sortBy: 'default', minPrice: 0, maxPrice: 10000 }
  }

  return {
    allProducts,
    filteredProducts,
    categories,
    total,
    loading,
    error,
    filters,
    fetchProducts,
    fetchCategories,
    resetFilters,
  }
}
