<template>
  <div>
    <label v-if="label" class="block text-gray-800" :class="labelStyle ? labelStyle : 'text-sm font-medium'">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative" @dragover.prevent @drop.stop.prevent="dragFile">
      <div
        v-if="showImage && (hasFileInSlot || (deleteImage && image))"
        class="flex absolute top-0 right-2 justify-center items-center w-7 h-7 text-gray-300 hover:text-red-500 bg-white rounded-full border-2 border-gray-300 hover:border-red-500 cursor-pointer"
        @click="clearFile"
      >
        <span class="text-base material-icons">delete</span>
      </div>
      <div
        class="flex flex-wrap justify-center items-center py-3 px-5 w-full cursor-pointer"
        :class="!hasFileInSlot && !(deleteImage && image) ? 'rounded-sm' : 'rounded-md'"
      >
        <label
          class="flex flex-col w-64 cursor-pointer"
          :class="
            (!hasFileInSlot && !(deleteImage && image)) || !showImage
              ? 'w-full border-4 border-gray-300 border-dashed hover:bg-gray-50 rounded-sm'
              : 'border-4 border-white hover:border-blue-600 rounded-md'
          "
        >
          <slot v-if="!image && !deleteImage" name="file" />
          <img
            v-if="showImage && fileType !== 'document' && (hasFileInSlot || image)"
            class="object-contain max-h-48"
            :src="image"
          />
          <div
            v-if="fileType === 'document' && fileName && image"
            class="flex flex-wrap justify-center items-center p-4 space-x-4"
          >
            <span class="material-icons">insert_drive_file</span>
            <a :href="image" target="_blank" class="hover:underline">{{ fileName }}</a>
          </div>
          <div
            v-if="(!hasFileInSlot && !(deleteImage && image)) || !showImage"
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
            :accept="acceptFormats"
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
    fileType: {
      type: String,
      default: 'image'
    },
    error: {
      type: String,
      default: ''
    },
    acceptFormats: {
      type: String,
      default: '.jpg,.jpeg,.png'
    },
    labelStyle: {
      type: String,
      default: undefined
    }
  },
  emits: ['change'],
  data() {
    return {
      image: undefined,
      fileName: undefined,
      deleteImage: false
    }
  },
  computed: {
    hasFileInSlot() {
      return (!!Object.keys(this.$slots).includes('file') || this.image) && !this.deleteImage
    }
  },
  methods: {
    dragFile(e) {
      this.$refs.inputFile.files = e.dataTransfer.files
      this.handleFileChange(undefined, e.dataTransfer.files[0])
    },
    handleFileChange(e, fileAttr = undefined) {
      this.fileName = undefined
      let file = fileAttr
      if (!fileAttr) {
        file = e.target.files[0]
      }
      this.fileName = file.name

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
