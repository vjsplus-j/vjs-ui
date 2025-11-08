<template>
  <div :class="cardClass">
    <div v-if="$slots.header || header" class="vjs-card__header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="vjs-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="vjs-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface CardProps {
  header?: string
  shadow?: 'always' | 'hover' | 'never'
  bordered?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {
  shadow: 'always',
  bordered: true,
})

const cardClass = computed(() => {
  return [
    'vjs-card',
    `vjs-card--shadow-${props.shadow}`,
    {
      'is-bordered': props.bordered,
    },
  ]
})
</script>

<style scoped>
.vjs-card {
  background-color: #fff;
  border-radius: var(--vjs-borderRadius-lg);
  overflow: hidden;
  transition: all var(--vjs-transition-base);
}

.vjs-card.is-bordered {
  border: 1px solid var(--vjs-colors-neutral-200);
}

.vjs-card--shadow-always {
  box-shadow: var(--vjs-boxShadow-base);
}

.vjs-card--shadow-hover {
  box-shadow: none;
}

.vjs-card--shadow-hover:hover {
  box-shadow: var(--vjs-boxShadow-lg);
}

.vjs-card--shadow-never {
  box-shadow: none;
}

.vjs-card__header {
  padding: var(--vjs-spacing-4) var(--vjs-spacing-5);
  border-bottom: 1px solid var(--vjs-colors-neutral-200);
  font-size: var(--vjs-fontSize-lg);
  font-weight: var(--vjs-fontWeight-semibold);
  color: var(--vjs-colors-neutral-900);
}

.vjs-card__body {
  padding: var(--vjs-spacing-5);
  color: var(--vjs-colors-neutral-700);
}

.vjs-card__footer {
  padding: var(--vjs-spacing-4) var(--vjs-spacing-5);
  border-top: 1px solid var(--vjs-colors-neutral-200);
  color: var(--vjs-colors-neutral-600);
}
</style>
