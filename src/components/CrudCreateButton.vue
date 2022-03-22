<template>
  <navigation-item
    :route-name="routeName"
    class="m-2"
    :class="customClass || ''"
    :label="label || $filters.uppercase($t('Create'))"
    icon="add"
    type="button"
    size="small"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import NavigationItem from '@/components/NavigationItem.vue'
export default defineComponent({
  components: { NavigationItem },
  props: {
    routeName: {
      type: String,
      required: true
    },
    customClass: {
      type: String,
      default: undefined
    },
    label: {
      type: String,
      default: undefined
    }
  }
})
</script>
