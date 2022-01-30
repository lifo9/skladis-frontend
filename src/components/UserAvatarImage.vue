<template>
  <div class="w-full text-center">
    <img
      v-if="row.attributes.avatar"
      class="inline object-cover w-12 h-12 rounded-full"
      :src="row.attributes.avatar"
    />
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    }
  }
}
</script>
