<template>
  <div :class="oneLine ? 'flex justify-between items-center space-x-4' : ''">
    <label
      v-if="label"
      class="block text-gray-800"
      :class="(oneLine ? 'mb-0' : 'mb-1', labelStyle ? labelStyle : 'text-sm font-medium')"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <div v-if="type === 'date'">
        <flat-pickr
          :model-value="modelValue"
          class="block text-base placeholder:text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none transition duration-500 ease-in-out"
          :class="[
            {
              'border-red-500': error,
              'w-auto': oneLine,
              'w-full': !oneLine,
              'py-3 px-5': !customPadding
            },
            customPadding
          ]"
          :config="extendedDateConfig"
          @input="handleInputChange"
        />
      </div>
      <input
        v-else
        class="block text-base placeholder:text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none transition duration-500 ease-in-out"
        :class="[
          {
            'border-red-500': error,
            'w-auto': oneLine,
            'w-full': !oneLine,
            'py-3 px-5': !customPadding
          },
          customPadding
        ]"
        :type="type === 'password' && showPassword ? 'text' : type"
        :value="modelValue"
        :required="required"
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
import 'flatpickr/dist/flatpickr.css'

import { Slovak } from 'flatpickr/dist/l10n/sk.js'
import { mapState } from 'pinia'
import { defineComponent } from 'vue'
import FlatPickr from 'vue-flatpickr-component'

import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: {
    FlatPickr
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
    labelStyle: {
      type: String,
      default: undefined
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
    },
    customPadding: {
      type: String,
      default: ''
    },
    dateConfig: {
      type: Object,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showPassword: false,
      dateLocalizations: { 'sk': Slovak },
      dateLocalization: undefined
    }
  },
  computed: {
    extendedDateConfig() {
      let config = {}

      if (this.dateLocalization) {
        config['locale'] = this.dateLocalization
      }

      config['dateFormat'] = 'd. M Y'

      if (this.dateConfig) {
        config = { ...config, ...this.dateConfig }
      }

      return config
    },
    ...mapState(useMainStore, ['appLanguage'])
  },
  mounted() {
    if (this.type === 'date' && this.appLanguage && this.appLanguage != 'en') {
      this.dateLocalization = this.dateLocalizations[this.appLanguage]
    }
  },
  methods: {
    handleInputChange(event) {
      this.$emit('update:modelValue', this.type === 'checkbox' ? event.target.checked : event.target.value)
    }
  }
})
</script>
