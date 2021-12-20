<template>
  <div>
    <label v-if="label" class="block mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="w-full">
      <select
        class="
      min-w-full
      form-select
      appearance-none
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-800
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      m-0"
        :class="error ? 'border-red-500' : ''"
        v-bind="$attrs"
        v-on="listeners"
      >
        <option v-if="!disableDefaultOption" value="" :selected="!value">
          {{ defaultOption }}
        </option>

        <option
          v-for="option in options"
          :key="option.id"
          :value="option.id"
          :selected="value && option.id == value"
        >
          {{ option.value }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
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

    value: {
      type: [String, Number],
      default: undefined
    },

    error: {
      type: String,
      default: undefined
    }
  },

  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: e => this.$emit('input', e.target.value)
      }
    }
  }
}

export function convertToOptions (items, idKey, labelKey) {
  return items.map(item => ({ id: item[idKey], value: item[labelKey] }))
}

export function optionsFromValues (values, dictionary) {
  return values.map(value => ({
    id: value,
    value: dictionary ? dictionary[value] : value
  }))
}
</script>

<style lang="postcss">
.form-select {
  -moz-padding-start: calc(0.75rem - 3px);
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-size: 16px 12px;
}
</style>
