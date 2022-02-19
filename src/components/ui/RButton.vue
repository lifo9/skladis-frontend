<template>
  <component
    :is="type"
    class="inline-flex justify-center items-center font-medium leading-6 active:bg-blue-700 rounded-md border border-transparent transition duration-150 ease-in-out"
    :class="btnClass"
    :loading="loading"
    :disabled="disabled"
    :size="size"
    :href="to"
  >
    <spinner v-if="loading" class="mr-3 ml-1" />
    <slot />
  </component>
</template>

<script lang="ts">
const sizes = ['verySmall', 'small', 'normal', 'full']
const variants = ['primary', 'secondary', 'danger', 'success']

import Spinner from '@/components/ui/Spinner.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: { Spinner },
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
      type: String
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

        'text-white bg-blue-600 hover:bg-blue-500 focus:border-blue-700': this.variant === 'primary',
        'text-white bg-green-600 hover:bg-green-500 focus:border-green-700': this.variant === 'success',
        'text-white bg-gray-600 hover:bg-gray-500 focus:border-gray-700': this.variant === 'secondary',
        'text-white bg-red-600 hover:bg-red-500 focus:border-red-700': this.variant === 'danger'
      }
    }
  }
})
</script>
