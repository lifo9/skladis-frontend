<template>
  <div>
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-800">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative" @dragover.prevent @drop.stop.prevent="dragFile">
      <div
        v-if="showImage && (hasImageInSlot || (deleteImage && image))"
        class="flex absolute top-0 right-2 justify-center items-center w-7 h-7 text-gray-300 hover:text-red-500 bg-white rounded-full border-2 border-gray-300 hover:border-red-500 cursor-pointer"
        @click="clearFile"
      >
        <span class="text-base material-icons">delete</span>
      </div>
      <div
        class="flex flex-wrap justify-center items-center py-3 px-5 w-full cursor-pointer"
        :class="!hasImageInSlot && !(deleteImage && image) ? 'rounded-sm' : 'rounded-md'"
      >
        <label
          class="flex flex-col w-64 cursor-pointer"
          :class="
            (!hasImageInSlot && !(deleteImage && image)) || !showImage
              ? 'w-full border-4 border-gray-300 border-dashed hover:bg-gray-50 rounded-sm'
              : 'border-4 border-white hover:border-blue-600 rounded-md'
          "
        >
          <slot v-if="!image && !deleteImage" name="image" />
          <img v-if="showImage && (hasImageInSlot || image)" class="object-contain max-h-48" :src="image" />
          <div
            v-if="(!hasImageInSlot && !(deleteImage && image)) || !showImage"
            class="pt-2 w-full h-full tracking-wider text-center text-gray-400 group-hover:text-gray-600 hover:text-blue-600 cursor-pointer"
          >
            <span class="text-5xl text-inherit material-icons">cloud_upload</span>
            <p class="p-2 text-base">{{ $t('Upload') }}</p>
          </div>
          <input
            v-bind="$attrs"
            ref="inputFile"
            type="file"
            class="w-0 h-0 opacity-0"
            accept=".jpg,.jpeg,.png"
            :value="value"
            :required="required"
            :disabled="disabled"
            @change="handleFileChange"
          />
        </label>
      </div>
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
    showImage: {
      type: Boolean,
      default: true
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  data() {
    return {
      image: undefined,
      deleteImage: false
    }
  },
  computed: {
    hasImageInSlot() {
      return (!!this.$slots.image || this.image) && !this.deleteImage
    }
  },
  methods: {
    dragFile(e) {
      this.$refs.inputFile.files = e.dataTransfer.files
      this.handleFileChange(undefined, e.dataTransfer.files[0])
    },
    handleFileChange(e, fileAttr = undefined) {
      let file = fileAttr
      if (!fileAttr) {
        file = e.target.files[0]
      }

      if (this.showImage) {
        this.image = URL.createObjectURL(file)
        this.$emit('change', file)
      } else {
        this.$emit('change', { file: file, blob: URL.createObjectURL(file) })
      }
    },
    clearFile() {
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
