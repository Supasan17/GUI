import { ref } from 'vue'
import type { Product } from '@/types'

export function useProduct() {
  const product = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProduct(id: number): Promise<void> {
    loading.value = true
    error.value = null
    product.value = null
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`)
      if (!res.ok) throw new Error('Product not found')
      product.value = await res.json() as Product
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load product'
    } finally {
      loading.value = false
    }
  }

  return { product, loading, error, fetchProduct }
}
