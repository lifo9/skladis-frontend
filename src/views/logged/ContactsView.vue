<template>
  <router-view />
</template>

<script lang="ts">
import { useMainStore } from '@/stores/mainStore'
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'
export default defineComponent({
  mounted() {
    this.setTitle()
  },
  updated() {
    this.setTitle()
  },
  computed: {
    ...mapStores(useMainStore)
  },
  methods: {
    setTitle() {
      this.mainStore.setCurrentTitle(this.$t('Contacts'))
    }
  }
})
</script>
