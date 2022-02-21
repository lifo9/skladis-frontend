<template>
  <router-view />
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import { useMainStore } from '@/stores/mainStore'
export default defineComponent({
  computed: {
    ...mapStores(useMainStore)
  },
  mounted() {
    this.setTitle()
  },
  updated() {
    this.setTitle()
  },
  methods: {
    setTitle() {
      this.mainStore.setCurrentTitle(this.$t('Contacts'))
    }
  }
})
</script>
