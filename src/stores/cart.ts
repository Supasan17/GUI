import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, CartSummary, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // Rehydrate from localStorage
  const stored = localStorage.getItem('luxe_cart')
  if (stored) {
    try {
      items.value = JSON.parse(stored) as CartItem[]
    } catch {
      localStorage.removeItem('luxe_cart')
    }
  }

  function persist(): void {
    localStorage.setItem('luxe_cart', JSON.stringify(items.value))
  }

  const summary = computed<CartSummary>(() => {
    const subtotal = items.value.reduce(
      (acc, i) => acc + i.product.price * i.quantity,
      0
    )
    const discount = items.value.reduce(
      (acc, i) =>
        acc + (i.product.price * i.product.discountPercentage / 100) * i.quantity,
      0
    )
    return {
      items: items.value,
      subtotal,
      discount,
      total: subtotal - discount,
      itemCount: items.value.reduce((acc, i) => acc + i.quantity, 0),
    }
  })

  const isInCart = (productId: number): boolean =>
    items.value.some((i) => i.product.id === productId)

  const getQuantity = (productId: number): number =>
    items.value.find((i) => i.product.id === productId)?.quantity ?? 0

  function addToCart(product: Product, qty = 1): void {
    const existing = items.value.find((i) => i.product.id === product.id)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, product.stock)
    } else {
      items.value.push({ product, quantity: qty })
    }
    persist()
  }

  function removeFromCart(productId: number): void {
    items.value = items.value.filter((i) => i.product.id !== productId)
    persist()
  }

  function updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    const item = items.value.find((i) => i.product.id === productId)
    if (item) {
      item.quantity = quantity
      persist()
    }
  }

  function clearCart(): void {
    items.value = []
    persist()
  }

  return {
    items,
    summary,
    isInCart,
    getQuantity,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
})
