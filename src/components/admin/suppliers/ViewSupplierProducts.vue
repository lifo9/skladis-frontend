<template>
  <navigation-item
    route-name="ProductsView"
    :label="$filters.uppercase($t('Products'))"
    class="m-1 text-white bg-green-600 hover:bg-green-500 active:bg-green-400 focus:border-green-700"
    icon="remove_red_eye"
    type="button"
    size="verySmall"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import NavigationItem from '@/components/NavigationItem.vue'
export default defineComponent({
  components: { NavigationItem }
})
</script>
