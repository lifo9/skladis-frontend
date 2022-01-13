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
  beforeDestroy () {
    this.$store.commit('unsetCurrentTitle')
  },
  methods: {
    setTitle () {
      this.$store.commit('setCurrentTitle', this.$t('Contacts'))
    }
  }
}
</script>
