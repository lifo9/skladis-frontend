<template>
  <div
    v-if="message !== null"
    class="fixed right-0 z-50 flex max-w-sm p-2 px-4 py-3 m-4 text-xl leading-none rounded-md cursor-pointer top-16"
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
    <span @click="message = null" class="absolute top-0 right-0 p-2 ">
      &times;
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      level: 'info',
      message: null
    }
  },
  mounted () {
    this.$root.$on('alert', (level, message) => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.level = level
      this.message = message

      setTimeout(() => {
        this.message = null
      }, 5000)
    })
  },
  watch: {
    $route (to, from) {
      this.level = 'info'
      this.message = null
    }
  }
}
</script>

<style lang="postcss" scoped>
.alert {
  @apply text-red-700 bg-red-100 border border-red-400;
}
.success {
  @apply text-green-700 bg-green-100 border border-green-400;
}
</style>
