<template>
  <div
    v-if="message !== null"
    class="flex fixed top-16 right-0 z-[9999] p-2 py-3 px-4 m-4 max-w-sm text-xl leading-none rounded-md cursor-pointer"
    :class="{
      info: level === 'info',
      success: level === 'success',
      alert: level === 'alert'
    }"
    role="alert"
    @click="message = null"
  >
    <span class="mr-4">
      {{ message }}
    </span>
    <span class="absolute top-0 right-0 p-2" @click="message = null">&times;</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  data() {
    return {
      level: 'info',
      message: null
    }
  },
  watch: {
    $route() {
      this.level = 'info'
      this.message = null
    }
  },
  mounted() {
    this.eventBus.on('alert', ({ level, message }) => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.level = level
      this.message = message

      setTimeout(() => {
        this.message = null
      }, 5000)
    })
  }
})
</script>

<style lang="postcss" scoped>
.alert {
  @apply text-red-700 bg-red-100 border border-red-400;
}
.success {
  @apply text-green-700 bg-green-100 border border-green-400;
}
</style>
