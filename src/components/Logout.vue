<template>
  <p @click="signOut">{{ $t('Logout') }}</p>
</template>

<script lang="ts">
import { signOut } from '@/services/UserService'

import { defineComponent } from 'vue'
export default defineComponent({
  methods: {
    async signOut() {
      try {
        await signOut()
      } catch (err) {
        // failed request after failed refresh token request automatically signs out
      }
      this.$store.commit('unsetCurrentUser')
      this.$router.replace('/sign-in')
    }
  }
})
</script>
