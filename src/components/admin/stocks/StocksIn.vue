<template>
  <div>
    <navigation-back />
    <div class="my-14 mx-auto space-y-6 w-full max-w-5xl"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import NavigationBack from '@/components/ui/NavigationBack.vue'

export default defineComponent({
  components: { NavigationBack }
})
</script>
