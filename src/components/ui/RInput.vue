<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-neutral-600 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        class="block
                w-full
                px-5
                py-3
                text-base
                text-neutral-600
                placeholder-gray-400
                transition
                duration-500
                ease-in-out
                transform
                border
                border-transparent
                rounded-md
                bg-gray-50
                focus:outline-none
                focus:border-transparent
                focus:ring-2
                focus:ring-white
                focus:ring-offset-1
                focus:ring-offset-gray-400"
        :class="[{ 'border-red-500': error }]"
        :type="type"
        :value="value"
        :required="required"
        v-bind="$attrs"
        v-on="listeners"
      />
    </div>

    <span
      v-if="error && error.length"
      class="py-2 text-red-500 text-xs font-bold"
    >
      {{ $t(error) }}
    </span>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: undefined
    },
    error: {
      type: String,
      default: ''
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: e => this.$emit('input', e.target.value),
        change: e => this.$emit('change', e.target.value)
      }
    }
  }
})
</script>