<template>
  <span v-if="label">
    <div v-if="options.json" class="block relative p-2 h-20 cursor-pointer" @click="showInfoModal">
      <div class="absolute top-0 right-0 px-8"><span class="text-blue-600 material-icons">search</span></div>
      <div class="overflow-auto h-16">
        <pre>{{ formattedLabel }}</pre>
      </div>
    </div>
    <span v-else-if="options.bold">
      <b>{{ formattedLabel }}</b>
    </span>
    <span v-else>
      {{ formattedLabel }}
    </span>
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
    },
    formattedLabel() {
      return this.options.format ? this.options.format(this.label) : this.label
    }
  },
  methods: {
    showInfoModal() {
      this.$vfm.show(
        {
          component: 'PlainModal'
        },
        { text: this.formattedLabel, json: this.options.json }
      )
    }
  }
})
</script>
