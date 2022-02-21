<template>
  <div class="flex flex-col p-2 space-y-6 w-full">
    <div v-if="error" class="relative py-3 px-4 text-red-700 bg-red-100 rounded-md border border-red-400" role="alert">
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <form class="space-y-6">
      <slot />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    error: {
      type: String,
      default: ''
    }
  }
})
</script>
