<template>
  <component
    :is="type"
    class="inline-flex justify-center items-center font-medium leading-6 rounded-md border border-transparent transition duration-150 ease-in-out"
    :class="btnClass"
    :loading="loading"
    :disabled="disabled"
    :size="size"
    :href="to"
  >
    <r-spinner v-if="loading" class="mr-3 ml-1 w-4 h-4 text-white" />
    <slot />
  </component>
</template>

<script lang="ts">
const sizes = ['verySmall', 'small', 'normal', 'full', 'min']
const variants = ['primary', 'secondary', 'danger', 'success', 'plain']

import { defineComponent } from 'vue'

import RSpinner from '@/components/ui/RSpinner.vue'

export default defineComponent({
  components: { RSpinner },
  props: {
    size: {
      default: 'normal',
      validator: (value) => sizes.includes(value)
    },
    variant: {
      default: 'primary',
      validator: (value) => variants.includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: undefined
    }
  },
  computed: {
    type() {
      if (this.to) {
        return 'a'
      }
      return 'button'
    },
    btnClass() {
      return {
        'cursor-not-allowed': this.disabled === true,
        'px-2 py-1 max-w-sm text-sm': this.size === 'verySmall',
        'px-4 py-2 max-w-md text-base': this.size === 'small',
        'px-6 py-3 max-w-md text-base': this.size === 'normal',
        'px-6 py-3 w-full text-base': this.size === 'full',
        'p-0 text-base': this.size === 'min',

        'text-white bg-blue-600 hover:bg-blue-500 focus:border-blue-700 active:bg-blue-400': this.variant === 'primary',
        'text-white bg-green-600 hover:bg-green-500 focus:border-green-700 active:bg-green-400':
          this.variant === 'success',
        'text-white bg-gray-600 hover:bg-gray-500 focus:border-gray-700 active:bg-gray-400':
          this.variant === 'secondary',
        'text-white bg-red-600 hover:bg-red-500 focus:border-red-700 active:bg-red-500': this.variant === 'danger',
        'bg-transparent hover:bg-transparent active:bg-transparent': this.variant === 'plain'
      }
    }
  }
})
</script>
