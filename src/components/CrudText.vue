<template>
  <span v-if="label">
    <pre v-if="options.json">{{ options.format ? options.format(label) : label }}</pre>
    <span v-else>{{ options.format ? options.format(label) : label }}</span>
  </span>
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
    label() {
      let label = undefined

      if (this.options.customCaption) {
        label = this.options.customCaption
      } else if (!this.options.relationship) {
        label = this.row.attributes[this.options.attribute]
      } else {
        const relatinships = this.row.relationships
        if (
          relatinships &&
          relatinships[this.options.relationship] &&
          relatinships[this.options.relationship].data &&
          this.included &&
          this.included.length > 0
        ) {
          const id = relatinships[this.options.relationship].data.id
          const type = relatinships[this.options.relationship].data.type
          if (id) {
            const relationObject = this.included.filter((included) => included.type === type && included.id === id)
            if (relationObject.length === 1) {
              if (Array.isArray(this.options.attribute)) {
                label = this.options.attribute.map((attribute) => relationObject[0].attributes[attribute]).join(' ')
              } else {
                label = relationObject[0].attributes[this.options.attribute]
              }
            }
          }
        }
      }

      if (this.options.format && this.options.format === 'currency') {
        return this.$filters.formatCurrency(label)
      } else {
        if (this.options.translate) {
          return this.$t(label)
        } else {
          return label
        }
      }
    }
  }
})
</script>
