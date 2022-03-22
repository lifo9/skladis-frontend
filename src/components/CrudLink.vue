<template>
  <div v-if="!link || !labels">
    <span>-</span>
  </div>
  <div v-else>
    <div v-if="options.editLink">
      <div v-for="label in labels" :key="label.id">
        <a href="#" @click.prevent="handleNavigation(label.id)">
          <span>
            {{ options.format ? options.format(label.label) : label.label }}
          </span>
        </a>
      </div>
    </div>
    <div v-else>
      <div v-for="label in labels" :key="label.id">
        <a v-if="link" :href="link" :target="options.newTab ? '_blank' : ''">
          <span>
            {{ options.format ? options.format(label.label) : label.label }}
          </span>
        </a>
      </div>
    </div>
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
  emits: ['navigated'],

  computed: {
    labels() {
      if (this.options.customCaption) {
        return [{ id: this.options.customCaption, label: this.options.customCaption }]
      } else if (!this.options.relationship) {
        if (this.options.editLinkIdColumn) {
          let label = ''
          if (this.options.translate) {
            label = this.$t(this.row.attributes[this.options.attribute])
          } else {
            label = this.row.attributes[this.options.attribute]
          }

          return [
            {
              id: this.row.attributes[this.options.editLinkIdColumn],
              label: label
            }
          ]
        } else {
          let label = ''
          if (this.options.translate) {
            label = this.$t(this.row.attributes[this.options.attribute])
          } else {
            label = this.row.attributes[this.options.attribute]
          }
          return [{ id: this.row.attributes[this.options.attribute], label: label }]
        }
      } else {
        const relatinships = this.row.relationships
        if (
          relatinships &&
          relatinships[this.options.relationship] &&
          relatinships[this.options.relationship].data &&
          this.included &&
          this.included.length > 0
        ) {
          if (Array.isArray(relatinships[this.options.relationship].data)) {
            let labels = []
            relatinships[this.options.relationship].data.forEach((relationship) => {
              const attributes = this.extractRelationshipObjectAttributes(relationship.id, relationship.type)
              const label = this.extractAttributeLabelFromRelationObject(attributes)
              if (label) {
                labels.push({ id: relationship.id, label: label })
              }
            })
            return labels
          } else {
            const id = relatinships[this.options.relationship].data.id
            const type = relatinships[this.options.relationship].data.type
            const attributes = this.extractRelationshipObjectAttributes(id, type)

            return [{ id: id, label: this.extractAttributeLabelFromRelationObject(attributes) }]
          }
        }
      }

      return undefined
    },
    link() {
      if (this.options.linkAttribute) {
        return this.row.attributes[this.options.linkAttribute]
      } else if (!this.options.relationship) {
        return this.row.attributes[this.options.attribute]
      }

      return '#'
    },
    editRouteName() {
      if (this.options.dynamicEditRoute) {
        return this.row.attributes[this.options.dynamicEditRoute] + 'Edit'
      } else {
        return this.options.editRouteName
      }
    }
  },

  methods: {
    async handleNavigation(id) {
      if (this.options.editLink) {
        let route = undefined

        try {
          route = this.$router.resolve({
            name: this.editRouteName,
            params: { id: id }
          })
        } catch (error) {}

        if (route) {
          try {
            await this.$router.push(route.href)
            this.$emit('navigated')
          } catch (error) {}
        }
      }
    },
    extractRelationshipObjectAttributes(id, type) {
      if (id && type && this.included) {
        const relationObject = this.included.filter((included) => included.type === type && included.id === id)

        if (relationObject.length === 1) {
          return relationObject[0].attributes
        }
      }

      return undefined
    },
    extractAttributeLabelFromRelationObject(attributes) {
      if (attributes) {
        if (Array.isArray(this.options.attribute)) {
          return this.options.attribute.map((attribute) => attributes[attribute]).join(' ')
        } else {
          if (this.options.translate) {
            return this.$t(attributes[this.options.attribute])
          } else {
            return attributes[this.options.attribute]
          }
        }
      }

      return undefined
    }
  }
})
</script>
