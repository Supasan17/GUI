# LUXE — Premium E-Commerce Store
> CS3404 GUI Programming · Mini Project

A modern, production-grade Single Page Application built with **Vue 3**, **TypeScript**, **Pinia**, **Vue Router**, and **Tailwind CSS**, consuming the [DummyJSON](https://dummyjson.com) public API.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

### Other Commands

```bash
npm run build        # Production build
npm run preview      # Preview production build
npm run type-check   # TypeScript validation
```

---

## ✅ Features Implemented

### Core (Pass–Credit)
- [x] Product listing fetched from `/products` endpoint
- [x] Search by keyword (`/products/search`)
- [x] Filter by category (`/products/category/:slug`)
- [x] Sort by price, rating, and name
- [x] Price range slider filter
- [x] Product detail view at `/product/:id` with image gallery

### Distinction (A Level)
- [x] **Authentication Simulation** — `/auth/login` with JWT stored in `localStorage`
- [x] **Shopping Cart** — Pinia store with full persistence across reloads
- [x] **Dynamic Routing** — Vue Router with `/product/:id` routes
- [x] **Dark Mode** — Tailwind `dark:` classes with toggle and persistence

### Outstanding (A+ Level)
- [x] Protected `/cart` route — redirects to `/login` if unauthenticated
- [x] Cart quantity control and real-time price calculation with discounts
- [x] Animated hero banner showcasing top-rated product
- [x] Mobile-responsive filter drawer (slide-in overlay)
- [x] Loading skeleton cards for every async state
- [x] Toast notification system (Pinia-driven)
- [x] 100% TypeScript strict mode — zero `any` types
- [x] Smooth page transitions and micro-animations
- [x] Star rating component with half-star precision
- [x] Full review section on product detail page

---

## 🏗 Architecture

```
src/
├── types/          # All TypeScript interfaces (Product, Auth, Cart, etc.)
├── stores/         # Pinia stores: auth, cart, ui
├── composables/    # useProducts, useProduct (API logic)
├── router/         # Vue Router with navigation guards
├── components/     # NavBar, ProductCard, FilterBar, CartItemRow,
│                   # SkeletonCard, StarRating, ToastNotification
└── views/          # HomeView, ProductDetailView, CartView, LoginView
```

---

## 🔑 Demo Login

Use the following DummyJSON credentials:

| Field    | Value        |
|----------|--------------|
| Username | `emilys`     |
| Password | `emilyspass` |

---

## 📦 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Vue 3 | ^3.4 | Composition API, reactivity |
| TypeScript | ^5.3 | Strict type safety |
| Vite | ^5.0 | Build tool & dev server |
| Pinia | ^2.1 | Global state management |
| Vue Router | ^4.3 | SPA routing |
| Tailwind CSS | ^3.4 | Utility-first styling |
| Axios | ^1.6 | HTTP client |
