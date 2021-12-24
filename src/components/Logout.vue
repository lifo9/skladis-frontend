<template>
  <p @click="signOut">{{ $t('Logout') }}</p>
</template>

<script>
import { signOut } from '../backend/services/UserService'

export default {
  methods: {
    async signOut () {
      try {
        await signOut()
      } catch (err) {
        // failed request after failed refresh token request automatically signs out
      }
      this.$store.commit('unsetCurrentUser')
      this.$router.replace('/sign-in')
    }
  }
}
</script>
