<template>
  <p @click="signOut">{{ $t('Logout') }}</p>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import { signOut } from '@/services/UserService'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  computed: {
    ...mapStores(useMainStore)
  },
  methods: {
    async signOut() {
      try {
        await signOut()
      } catch (err) {
        // failed request after failed refresh token request automatically signs out
      }
      this.mainStore.unsetCurrentUser()
      this.$router.replace('/sign-in')
    }
  }
})
</script>
