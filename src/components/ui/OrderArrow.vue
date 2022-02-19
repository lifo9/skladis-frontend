<template>
  <span @click="click" class="cursor-pointer material-icons" :class="order === 'asc' ? 'transform-rotate-180' : ''">
    arrow_drop_down
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    order: {
      type: String,
      default: 'asc'
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
})
</script>

<style lang="postcss">
.transform-rotate-180 {
  transform: rotate(180deg);
}
</style>
