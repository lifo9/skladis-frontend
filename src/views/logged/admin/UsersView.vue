<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  mounted() {
    this.setTitle()
  },
  updated() {
    this.setTitle()
  },
  methods: {
    setTitle() {
      this.$store.commit('setCurrentTitle', this.$t('Users'))
    }
  }
})
</script>
