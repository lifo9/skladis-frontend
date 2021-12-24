<template>
  <p @click="signOut">{{ $t('Logout') }}</p>
</template>

<script>
import { signOut } from '../backend/services/UserService'

export default {
  methods: {
    async signOut () {
      await signOut()
      this.$store.commit('unsetCurrentUser')
      this.$router.replace('/sign-in')
    }
  }
}
</script>
