<template>
  <div class="text-center min-w-max">
    <img
      v-if="row.attributes[options.attribute]"
      class="inline object-cover w-12 h-12 rounded-full"
      :src="row.attributes[options.attribute]"
    />
  </div>
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
