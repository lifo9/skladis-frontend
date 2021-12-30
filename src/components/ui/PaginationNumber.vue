<template>
  <a
    href="javascript:"
    class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border"
    :class="current === page ? 'text-blue-600 border-blue-500 bg-blue-50' : ''"
    @click="changePage(page)"
  >
    {{ page }}
  </a>
</template>

<script>
export default {
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
    changePage (page) {
      this.$emit('change', page)
    }
  }
}
</script>
