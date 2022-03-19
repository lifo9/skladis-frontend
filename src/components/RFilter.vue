<template>
  <div class="p-2 max-w-xl md:p-0">
    <div class="flex flex-wrap items-center mb-2 text-3xl cursor-pointer select-none" @click="opened = !opened">
      <span class="text-gray-800 material-icons">filter_alt</span>
      <span class="text-lg">
        <b>{{ $filters.capitalize($t('filter')) }}</b>
      </span>
    </div>
    <div v-if="opened" class="md:p-2">
      <div v-for="(option, key) in options" :key="key" class="py-2">
        <p class="mb-1 text-sm select-none">
          <b>{{ option.label }}</b>
        </p>
        <multiselect
          v-model="selected[key]"
          :options="option.options"
          :multiple="true"
          :taggable="true"
          :searchable="true"
          track-by="id"
          label="label"
          :placeholder="option.label"
          :tag-placeholder="option.label"
          :select-label="$t('select')"
          :selected-label="$t('deselect')"
          :deselect-label="$t('deselect')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Multiselect from 'vue-multiselect'

export default defineComponent({
  components: { Multiselect },
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  emits: ['filter'],
  data() {
    return {
      selected: {},
      opened: false
    }
  },
  watch: {
    selected: {
      handler() {
        this.handleFilterChange()
      },
      deep: true
    }
  },
  mounted() {
    this.selectFilterOptions()
    this.openFilter()
  },
  methods: {
    handleFilterChange() {
      let query = { ...this.$route.query }
      let filters = {}

      Object.keys(this.selected).forEach((option) => {
        if (this.selected[option] && this.selected[option].length > 0) {
          query[option] = this.selected[option].map((option) => option.id)
          filters[option] = query[option]
        } else if (this.selected[option] && this.selected[option].length === 0) {
          delete query[option]
        }
      })

      this.$router.push({ path: this.$route.path, query: query })
      this.$emit('filter', filters)
    },
    selectFilterOptions() {
      let selected = {}
      Object.keys(this.$route.query).forEach((query) => {
        if (this.options[query]) {
          const option = this.options[query]
          selected[query] = option.options.filter((option) => {
            if (Array.isArray(this.$route.query[query])) {
              return this.$route.query[query]?.includes(option.id.toString())
            } else {
              return this.$route.query[query] === option.id.toString()
            }
          })
        }
      })
      this.selected = selected
    },
    openFilter() {
      if (Object.keys(this.selected).length > 0) {
        this.opened = true
      }
    }
  }
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
