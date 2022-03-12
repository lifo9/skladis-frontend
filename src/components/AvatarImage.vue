<template>
  <div class="w-max text-center">
    <img
      v-if="imageSource"
      class="inline object-cover w-12 h-12"
      :class="options.rounded ? 'rounded-full' : ''"
      :src="imageSource"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    options: {
      type: Object,
      default: undefined
    },
    row: {
      type: Object,
      required: true
    },
    included: {
      type: Array,
      default: undefined
    }
  },
  computed: {
    imageSource() {
      const attribute = this.row.attributes[this.options.attribute]
      if (attribute) {
        if (Array.isArray(attribute)) {
          if (attribute.length > 0) {
            if (this.options.subAttribute) {
              return attribute[0][this.options.subAttribute]
            } else {
              return attribute[0]
            }
          }
        } else {
          if (this.options.subAttribute) {
            return attribute[this.options.subAttribute]
          } else {
            return attribute
          }
        }
      }
      return undefined
    }
  }
})
</script>
