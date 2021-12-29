<template>
  <span
    @click="click"
    class="cursor-pointer material-icons"
    :class="order === 'asc' ? 'transform-rotate-180' : ''"
    >arrow_drop_down</span
  >
</template>

<script>
export default {
  props: {
    order: {
      type: String,
      default: 'asc'
    }
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>
