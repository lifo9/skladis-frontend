<template>
  <component
    :is="type"
    v-on="$listeners"
    class="inline-flex items-center justify-center font-medium leading-6 transition duration-150 ease-in-out border border-transparent rounded-md active:bg-blue-700"
    :class="btnClass"
    :loading="loading"
    :disabled="disabled"
    :size="size"
    :href="to"
  >
    <spinner v-if="loading" class="ml-1 mr-3" />
    <slot />
  </component>
</template>

<script>
import Vue from 'vue'
import Spinner from './Spinner.vue'

const sizes = ['verySmall', 'small', 'normal', 'full']
const variants = ['primary', 'secondary', 'danger']

export default Vue.extend({
  components: { Spinner },
  props: {
    size: {
      default: 'normal',
      validator: value => sizes.includes(value)
    },
    variant: {
      default: 'primary',
      validator: value => variants.includes(value)
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
    type () {
      if (this.to) {
        return 'a'
      }
      return 'button'
    },
    btnClass () {
      return {
        'cursor-not-allowed': this.disabled === true,
        'px-2 py-1 max-w-sm text-sm': this.size === 'verySmall',
        'px-4 py-2 max-w-md text-base': this.size === 'small',
        'px-6 py-3 max-w-md text-base': this.size === 'normal',
        'px-6 py-3 w-full text-base': this.size === 'full',

        'text-white bg-blue-600 hover:bg-blue-500 focus:border-blue-700':
          this.variant === 'primary',
        'text-white bg-gray-600 hover:bg-gray-500 focus:border-gray-700':
          this.variant === 'secondary',
        'text-white bg-red-600 hover:bg-red-500 focus:border-red-700':
          this.variant === 'danger'
      }
    }
  }
})
</script>
