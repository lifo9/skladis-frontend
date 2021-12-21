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
      } catch (error) {}
      this.$store.commit('unsetCurrentUser')
      this.$router.replace('/sign-in')
    }
  }
}
</script>
