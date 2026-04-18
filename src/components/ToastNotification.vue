<script setup lang="ts">
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

const iconMap = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 18L18 6M6 6l12 12',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const colorMap = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-brand-500',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in ui.toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 min-w-72 max-w-sm bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-100 dark:border-neutral-800 px-4 py-3"
        >
          <div :class="['w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0', colorMap[toast.type]]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="iconMap[toast.type]"/>
            </svg>
          </div>
          <p class="text-sm font-body text-neutral-800 dark:text-neutral-200 flex-1">{{ toast.message }}</p>
          <button @click="ui.dismissToast(toast.id)" class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to   { opacity: 0; transform: translateX(100%); }
</style>
