<template>
  <div>
    <navigation-back />
    <div class="my-14 mx-auto space-y-6 w-full max-w-5xl"></div>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import NavigationBack from '@/components/ui/NavigationBack.vue'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { NavigationBack },
  computed: {
    ...mapStores(useMainStore)
  },
  mounted() {
    this.setTitle()
  },
  methods: {
    setTitle() {
      this.mainStore.setCurrentTitle(this.$t('Delivery of goods'))
      this.mainStore.setCurrentSubtitle(this.$t('Stocks in'))
    }
  }
})
</script>
