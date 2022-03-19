<template>
  <navigation-item
    v-if="customRoute"
    class="flex items-center text-blue-600 cursor-pointer"
    type="plain"
    :route-name="customRoute"
    :label="$t('Back')"
  >
    <span class="material-icons">arrow_back</span>
  </navigation-item>
  <router-link
    v-else-if="$router.options.history.state.back"
    class="flex items-center text-blue-600"
    :to="$router.options.history.state.back"
  >
    <span class="material-icons">arrow_back</span>
    {{ $t('Back') }}
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import NavigationItem from '@/components/NavigationItem.vue'

export default defineComponent({
  components: { NavigationItem },
  props: {
    customRoute: {
      type: String,
      default: undefined
    }
  }
})
</script>
