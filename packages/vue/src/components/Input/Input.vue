<template>
  <div :class="wrapperClass">
    <input
      ref="inputRef"
      :class="inputClass"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface InputProps {
  modelValue?: string | number
  type?: 'text' | 'password' | 'number' | 'email' | 'tel'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  maxlength?: number
  size?: 'large' | 'default' | 'small'
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  clearable: false,
  size: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [value: string | number]
  change: [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)

const wrapperClass = computed(() => {
  return [
    'vjs-input',
    `vjs-input--${props.size}`,
    {
      'is-disabled': props.disabled,
      'is-focused': isFocused.value,
    },
  ]
})

const inputClass = computed(() => {
  return 'vjs-input__inner'
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  emit('update:modelValue', value)
  emit('input', value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change', target.value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

// 暴露方法
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<style scoped>
.vjs-input {
  position: relative;
  display: inline-block;
  width: 100%;
}

.vjs-input__inner {
  width: 100%;
  padding: var(--vjs-spacing-2) var(--vjs-spacing-3);
  font-size: var(--vjs-fontSize-sm);
  line-height: var(--vjs-lineHeight-normal);
  color: var(--vjs-colors-neutral-900);
  background-color: #fff;
  border: 1px solid var(--vjs-colors-neutral-300);
  border-radius: var(--vjs-borderRadius-base);
  outline: none;
  transition: all var(--vjs-transition-base);
}

.vjs-input__inner:hover {
  border-color: var(--vjs-colors-primary-300);
}

.vjs-input__inner:focus {
  border-color: var(--vjs-colors-primary-500);
  box-shadow: 0 0 0 2px var(--vjs-colors-primary-50);
}

.vjs-input__inner::placeholder {
  color: var(--vjs-colors-neutral-400);
}

.vjs-input--large .vjs-input__inner {
  padding: var(--vjs-spacing-3) var(--vjs-spacing-4);
  font-size: var(--vjs-fontSize-base);
}

.vjs-input--small .vjs-input__inner {
  padding: var(--vjs-spacing-1) var(--vjs-spacing-2);
  font-size: var(--vjs-fontSize-xs);
}

.vjs-input.is-disabled .vjs-input__inner {
  background-color: var(--vjs-colors-neutral-100);
  cursor: not-allowed;
  opacity: 0.6;
}

.vjs-input.is-focused .vjs-input__inner {
  border-color: var(--vjs-colors-primary-500);
}
</style>
