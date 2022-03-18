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
    relationships: {
      type: Array,
      default: undefined
    },
    included: {
      type: Array,
      default: undefined
    }
  },
  computed: {
    imageSource() {
      const attribute = this.row.attributes[this.options.attribute]
      const relationships = this.row.relationships

      if (
        relationships &&
        relationships[this.options.relationship] &&
        relationships[this.options.relationship].data &&
        this.included &&
        this.included.length > 0
      ) {
        const id = relationships[this.options.relationship].data.id
        const type = relationships[this.options.relationship].data.type
        if (id) {
          const relationObject = this.included.filter((included) => included.type === type && included.id === id)
          if (relationObject.length === 1) {
            return relationObject[0].attributes[this.options.attribute]
          }
        }
      } else {
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
      }
      return undefined
    }
  }
})
</script>
