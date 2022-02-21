<template>
  <div :class="oneLine ? 'flex justify-between items-center space-x-4' : ''">
    <label v-if="label" class="block text-sm font-medium text-gray-800" :class="oneLine ? 'mb-0' : 'mb-1'">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        class="block py-3 px-5 text-base text-gray-900 placeholder:text-gray-400 bg-gray-50 rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none transition duration-500 ease-in-out"
        :class="[{ 'border-red-500': error, 'w-auto': oneLine, 'w-full': !oneLine }]"
        :type="type === 'password' && showPassword ? 'text' : type"
        :value="modelValue"
        ::required="true"
        :checked="type === 'checkbox' && modelValue === true"
        :disabled="disabled"
        v-bind="$attrs"
        @input="handleInputChange"
        @change="handleInputChange"
      />
      <span
        v-if="enablePasswordToggle && type === 'password'"
        class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer select-none material-icons"
        @click="showPassword = !showPassword"
      >
        remove_red_eye
      </span>
    </div>
    <span v-if="error && error.length" class="py-2 text-xs font-bold text-red-500">
      {{ $t(error) }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
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
    modelValue: {
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
    },
    oneLine: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showPassword: false
    }
  },
  methods: {
    handleInputChange(event) {
      this.$emit('update:modelValue', this.type === 'checkbox' ? event.target.checked : event.target.value)
    }
  }
})
</script>
