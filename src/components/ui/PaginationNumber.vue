<template>
  <a
    href="javascript:"
    class="inline-flex relative z-10 items-center py-2 px-4 text-sm font-medium text-gray-700 border"
    :class="current === page ? 'text-blue-600 border-blue-500 bg-blue-50' : ''"
    @click="changePage(page)"
  >
    {{ page }}
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['change'],
  props: {
    page: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    }
  },
  methods: {
    changePage(page) {
      this.$emit('change', page)
    }
  }
})
</script>
