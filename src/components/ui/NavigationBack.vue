<template>
  <router-link class="flex items-center text-blue-600" :to="$router.options.history.state.back">
    <span class="material-icons">arrow_back</span>
    {{ $t('Back') }}
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
