<template>
  <div>
    <button
      class="
        flex
        items-center
        justify-center
        w-full
        px-10
        py-4
        text-base
        font-medium
        text-center text-white
        transition
        duration-500
        ease-in-out
        transform
        bg-blue-400
        rounded-xl
        hover:bg-blue-500
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-blue-500"
      @click="signOut"
    >
      Logout
    </button>
  </div>
</template>

<script>
import { signOut } from '../backend/services/UserService'

export default {
  methods: {
    async signOut () {
      try {
        await signOut()
        this.$store.commit('unsetCurrentUser')
        this.$router.replace('/sign-in')
      } catch (error) {}
    }
  }
}
</script>
