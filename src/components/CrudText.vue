<template>
  <span v-if="label">
    {{ label }}
  </span>
</template>

<script>
export default {
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
    label () {
      if (this.options.customCaption) {
        return this.options.customCaption
      } else if (!this.options.relationship) {
        return this.row.attributes[this.options.attribute]
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
            const relationObject = this.included.filter(
              included => included.type === type && included.id === id
            )
            if (relationObject.length === 1) {
              if (Array.isArray(this.options.attribute)) {
                return this.options.attribute
                  .map(attribute => relationObject[0].attributes[attribute])
                  .join(' ')
              } else {
                return relationObject[0].attributes[this.options.attribute]
              }
            }
          }
        }
      }

      return undefined
    }
  }
}
</script>
