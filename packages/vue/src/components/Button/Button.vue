<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    :type="nativeType"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ButtonProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  loading?: boolean
  round?: boolean
  circle?: boolean
  nativeType?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'default',
  disabled: false,
  loading: false,
  round: false,
  circle: false,
  nativeType: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => {
  return [
    'vjs-button',
    `vjs-button--${props.type}`,
    `vjs-button--${props.size}`,
    {
      'is-disabled': props.disabled || props.loading,
      'is-loading': props.loading,
      'is-round': props.round,
      'is-circle': props.circle,
    },
  ]
})

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<style scoped>
.vjs-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--vjs-spacing-2) var(--vjs-spacing-4);
  font-size: var(--vjs-fontSize-sm);
  border-radius: var(--vjs-borderRadius-base);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--vjs-transition-base);
  user-select: none;
  outline: none;
}

.vjs-button--default {
  color: var(--vjs-colors-neutral-900);
  background-color: var(--vjs-colors-neutral-50);
  border-color: var(--vjs-colors-neutral-300);
}

.vjs-button--default:hover {
  color: var(--vjs-colors-primary-500);
  border-color: var(--vjs-colors-primary-300);
}

.vjs-button--primary {
  color: #fff;
  background-color: var(--vjs-colors-primary-500);
  border-color: var(--vjs-colors-primary-500);
}

.vjs-button--primary:hover {
  background-color: var(--vjs-colors-primary-400);
}

.vjs-button--success {
  color: #fff;
  background-color: var(--vjs-colors-success-500);
  border-color: var(--vjs-colors-success-500);
}

.vjs-button--warning {
  color: #fff;
  background-color: var(--vjs-colors-warning-500);
  border-color: var(--vjs-colors-warning-500);
}

.vjs-button--danger {
  color: #fff;
  background-color: var(--vjs-colors-error-500);
  border-color: var(--vjs-colors-error-500);
}

.vjs-button--large {
  padding: var(--vjs-spacing-3) var(--vjs-spacing-6);
  font-size: var(--vjs-fontSize-base);
}

.vjs-button--small {
  padding: var(--vjs-spacing-1) var(--vjs-spacing-3);
  font-size: var(--vjs-fontSize-xs);
}

.vjs-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.vjs-button.is-round {
  border-radius: var(--vjs-borderRadius-full);
}

.vjs-button.is-circle {
  border-radius: 50%;
  padding: var(--vjs-spacing-2);
}
</style>
