// ─── Product Types ────────────────────────────────────────────────────────────

export interface ProductDimensions {
  width: number
  height: number
  depth: number
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductMeta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: ProductDimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: ProductReview[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: ProductMeta
  images: string[]
  thumbnail: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface CategoryList extends Array<string> {}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
  refreshToken: string
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartSummary {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  itemCount: number
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  search: string
  category: string
  sortBy: SortOption
  minPrice: number
  maxPrice: number
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'name'

// ─── UI State Types ───────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}
