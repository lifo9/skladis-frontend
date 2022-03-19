<template>
  <navigation-item
    :route-name="options.route"
    :params="{ id: row.id }"
    :label="options.label || $filters.uppercase($t('view'))"
    class="m-1 text-white"
    :class="options.customClass || ''"
    icon="remove_red_eye"
    type="button"
    size="verySmall"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import NavigationItem from '@/components/NavigationItem.vue'
export default defineComponent({
  components: { NavigationItem },
  props: {
    options: {
      type: Object,
      default: undefined
    },
    row: {
      type: Object,
      required: true
    },
    included: {
      type: Array,
      default: undefined
    }
  }
})
</script>
