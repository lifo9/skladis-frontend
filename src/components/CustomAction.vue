<template>
  <r-button size="verySmall" @click="$emit('click', row.id)">CLICK</r-button>
</template>

<script>
import RButton from './ui/RButton.vue'
export default {
  components: { RButton },
  props: {
    row: {
      type: Object,
      required: true
    }
  }
}
</script>
