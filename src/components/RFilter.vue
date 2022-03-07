<template>
  <div class="p-2 max-w-md">
    <div class="flex flex-wrap items-center text-3xl cursor-pointer select-none" @click="opened = !opened">
      <span class="text-gray-800 material-icons">filter_alt</span>
      <span class="text-lg">
        <b>{{ $filters.capitalize($t('filter')) }}</b>
      </span>
    </div>
    <div v-if="opened" class="md:p-2">
      <div v-for="(option, key) in options" :key="key">
        <p class="text-sm select-none">
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
          :placeholder="$t('Suppliers')"
          :tag-placeholder="$t('Suppliers')"
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
      if (Object.keys(this.selected).length === 0) {
        return
      }

      let query = {}
      Object.keys(this.selected).forEach((option) => {
        if (this.selected[option] && this.selected[option].length > 0) {
          query[option] = this.selected[option].map((option) => option.id)
        }
      })

      this.$router.push({ path: this.$route.path, query: query })
      this.$emit('filter', query)
    },
    selectFilterOptions() {
      let selected = {}
      Object.keys(this.$route.query).forEach((query) => {
        console.log(query, this.options)
        if (this.options[query]) {
          const option = this.options[query]

          selected[query] = option.options.filter((option) => {
            if (Array.isArray(this.$route.query[query])) {
              return this.$route.query[query]?.includes(option.id)
            } else {
              return this.$route.query[query] === option.id
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
