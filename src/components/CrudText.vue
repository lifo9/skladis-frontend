<template>
  <span v-if="row.attributes[options.attribute]">
    {{ row.attributes[options.attribute] }}
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
    }
  }
}
</script>
