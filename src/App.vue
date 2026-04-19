<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import ToastNotification from '@/components/ToastNotification.vue'
</script>

<template>
  <div class="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300">
    <NavBar />
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <ToastNotification />

    <!-- Footer -->
    <footer class="mt-20 border-t border-neutral-100 dark:border-neutral-800 py-8 text-center">
      <p class="font-display text-2xl font-bold text-neutral-900 dark:text-white mb-1">LUXE</p>
      <p class="text-sm font-mono text-neutral-400">CS3404 Mini Project · Built with Vue 3 + TypeScript + Tailwind CSS</p>
    </footer>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
