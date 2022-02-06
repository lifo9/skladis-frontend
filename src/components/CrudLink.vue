<template>
  <a
    v-if="row.attributes[options.attribute]"
    :href="row.attributes[options.attribute]"
    :target="options.newTab ? '_blank' : ''"
  >
    <span v-if="options.customCaption">
      {{ options.customCaption }}
    </span>
    <span v-else>
      {{ row.attributes[options.attribute] }}
    </span>
  </a>
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
