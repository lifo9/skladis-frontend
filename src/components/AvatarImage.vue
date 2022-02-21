<template>
  <div class="w-max text-center">
    <img
      v-if="row.attributes[options.attribute]"
      class="inline object-cover w-12 h-12 rounded-full"
      :src="row.attributes[options.attribute]"
    />
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
  }
})
</script>
