<template>
  <div>
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-800">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <div
        v-if="hasImageInSlot || (deleteImage && image)"
        class="absolute top-0 flex items-center justify-center text-gray-300 bg-white border-2 border-gray-300 rounded-full cursor-pointer hover:border-red-500 hover:text-red-500 right-2 w-7 h-7"
        @click="clearFile"
      >
        <span class="text-base material-icons">delete</span>
      </div>
      <div
        class="flex flex-wrap items-center justify-center w-full px-5 py-3 cursor-pointer"
        :class="
          !hasImageInSlot && !(deleteImage && image)
            ? 'rounded-sm'
            : 'rounded-md'
        "
      >
        <label
          class="flex flex-col cursor-pointer"
          :class="
            !hasImageInSlot && !(deleteImage && image)
              ? 'w-full border-4 border-gray-300 border-dashed hover:bg-gray-50 rounded-sm'
              : 'border-4 border-white hover:border-blue-600 rounded-md'
          "
        >
          <slot v-if="!image && !deleteImage" name="image" />
          <img
            class="object-contain max-h-48"
            v-if="hasImageInSlot || image"
            :src="image"
          />
          <div
            v-if="!hasImageInSlot && !(deleteImage && image)"
            class="w-full h-full pt-2 tracking-wider text-center text-gray-400 cursor-pointer group-hover:text-gray-600 hover:text-blue-600"
          >
            <span class="text-5xl material-icons text-inherit"
              >cloud_upload</span
            >
            <p class="p-2 text-base">{{ $t('Upload') }}</p>
          </div>
          <input
            type="file"
            class="w-0 h-0 opacity-0"
            accept=".jpg,.jpeg,.png"
            :value="value"
            :required="required"
            :disabled="disabled"
            v-bind="$attrs"
            ref="inputFile"
            @change="handleFileChange"
          />
        </label>
      </div>
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
      image: undefined,
      deleteImage: false
    }
  },

  props: {
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
    value: {
      type: [String, Number, Boolean],
      default: undefined
    },
    error: {
      type: String,
      default: ''
    }
  },
  computed: {
    hasImageInSlot () {
      return (!!this.$slots.image || this.image) && !this.deleteImage
    }
  },
  methods: {
    handleFileChange (e) {
      const file = e.target.files[0]
      this.image = URL.createObjectURL(file)

      this.$emit('change', file)
    },
    clearFile () {
      this.$refs.inputFile.value = null
      if (!this.image) {
        this.deleteImage = true
      }
      this.image = undefined
      this.$emit('change', undefined)
    }
  }
})
</script>
