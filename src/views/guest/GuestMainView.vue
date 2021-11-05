<template>
  <div class="container mx-auto">
    <sign-in v-if="isSignIn" />
    <sign-up v-if="isSignUp" />
  </div>
</template>

<script>
import SignIn from '../../components/SignIn.vue'
import SignUp from '../../components/SignUp.vue'

export default {
  components: { SignIn, SignUp },
  computed: {
    isSignIn () {
      return this.$route.name === 'SignIn'
    },
    isSignUp () {
      return this.$route.name === 'SignUp'
    }
  }
}
</script>
