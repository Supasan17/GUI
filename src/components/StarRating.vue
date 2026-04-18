<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ rating: number; count?: number }>()

const stars = computed(() =>
  Array.from({ length: 5 }, (_, i) => {
    const val = props.rating - i
    if (val >= 1) return 'full'
    if (val >= 0.5) return 'half'
    return 'empty'
  })
)
</script>

<template>
  <div class="flex items-center gap-1.5">
    <div class="flex items-center">
      <svg
        v-for="(type, i) in stars"
        :key="i"
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        viewBox="0 0 24 24"
      >
        <defs>
          <linearGradient :id="`half-${i}`">
            <stop offset="50%" stop-color="#f59e0b"/>
            <stop offset="50%" stop-color="#d1d5db"/>
          </linearGradient>
        </defs>
        <path
          :fill="type === 'full' ? '#f59e0b' : type === 'half' ? `url(#half-${i})` : '#d1d5db'"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    </div>
    <span class="text-sm font-mono text-neutral-500 dark:text-neutral-400">
      {{ rating.toFixed(1) }}<span v-if="count" class="text-neutral-400"> ({{ count }})</span>
    </span>
  </div>
</template>
