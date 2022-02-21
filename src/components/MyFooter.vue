<template>
  <footer class="flex bottom-0 z-50 justify-center items-center w-full h-12 text-white bg-gray-800">
    Copyright © {{ new Date().getFullYear() }}
    <a href="https://filo.dev" target="_blank" class="ml-2 text-white">Jakub Filo</a>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>
