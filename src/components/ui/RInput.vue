<template>
  <div>
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-800">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        class="block w-full px-5 py-3 text-base text-gray-900 placeholder-gray-400 transition duration-500 ease-in-out transform border border-gray-400 rounded-md bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-blue-600"
        :class="[{ 'border-red-500': error }]"
        :type="type === 'password' && showPassword ? 'text' : type"
        :value="value"
        :required="required"
        :checked="type === 'checkbox' && value === true"
        :disabled="disabled"
        v-bind="$attrs"
        v-on="listeners"
      />
      <span
        v-if="enablePasswordToggle && type === 'password'"
        class="absolute transform -translate-y-1/2 cursor-pointer select-none top-1/2 right-4 material-icons"
        @click="showPassword = !showPassword"
        >remove_red_eye</span
      >
    </div>
    <span
      v-if="error && error.length"
      class="py-2 text-xs font-bold text-red-500"
    >
      {{ $t(error) }}
    </span>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      showPassword: false
    }
  },

  props: {
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
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
      type: [String, Number, Boolean],
      default: undefined
    },
    error: {
      type: String,
      default: ''
    },
    enablePasswordToggle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: e => this.$emit('input', e.target.value),
        change: e =>
          this.$emit(
            'change',
            this.type === 'checkbox' ? e.target.checked : e.target.value
          )
      }
    }
  }
})
</script>
