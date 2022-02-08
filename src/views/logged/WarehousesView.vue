<template>
  <router-view />
</template>

<script>
export default {
  mounted () {
    this.setTitle()
  },
  updated () {
    this.setTitle()
  },
  methods: {
    setTitle () {
      this.$store.commit('setCurrentTitle', this.$t('Warehouses'))
    }
  }
}
</script>
