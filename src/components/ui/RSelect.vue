<template>
  <div>
    <label v-if="label" class="block mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="w-full form-select">
      <select
        class="py-1.5 pr-7 pl-3 m-0 w-full text-base font-normal text-gray-800 bg-clip-padding bg-white bg-no-repeat rounded border border-gray-300 border-solid appearance-none"
        :class="error ? 'border-red-500' : ''"
        v-bind="$attrs"
        @input="handleInputChange"
      >
        <option v-if="!disableDefaultOption" value="" :selected="!modelValue">
          {{ defaultOption }}
        </option>

        <option
          v-for="option in options"
          :key="option.id"
          :value="option.id"
          :selected="modelValue && option.id == modelValue"
        >
          {{ option.value }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    label: {
      type: String,
      default: undefined
    },

    options: {
      type: Array,
      required: true
    },

    required: {
      type: Boolean,
      default: false
    },

    defaultOption: {
      type: String,
      default: '-'
    },

    disableDefaultOption: {
      type: Boolean,
      default: true
    },

    modelValue: {
      type: [String, Number],
      default: undefined
    },

    error: {
      type: String,
      default: undefined
    }
  },
  methods: {
    handleInputChange(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  }
})

export function convertToOptions(items, idKey, labelKey) {
  return items.map((item) => ({ id: item[idKey], value: item[labelKey] }))
}

export function optionsFromValues(values, dictionary = undefined) {
  return values.map((value) => ({
    id: value,
    value: dictionary ? dictionary[value] : value
  }))
}
</script>

<style lang="postcss">
.form-select {
  @apply relative;
}
.form-select::before {
  @apply absolute top-1/2 transform -translate-y-1/2 mx-2 right-0;
  content: '';
  width: 16px;
  height: 12px;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3E%3C/svg%3E");
  background-size: 16px 12px;
  background-repeat: no-repeat;
}
</style>
