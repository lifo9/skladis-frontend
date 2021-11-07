<template>
  <div>
    <my-header />
    <main class="container mx-auto px-4 md:px-12">
      <sign-in v-if="isSignIn" />
      <sign-up v-if="isSignUp" />
    </main>
    <my-footer class="fixed" />
  </div>
</template>

<script>
import LanguageSwitcher from '../../components/LanguageSwitcher.vue'
import SignIn from '../../components/SignIn.vue'
import SignUp from '../../components/SignUp.vue'
import Logo from '../../components/ui/Logo.vue'
import MyFooter from '../../components/Footer.vue'
import MyHeader from '../../components/Header.vue'

export default {
  components: { SignIn, SignUp, Logo, LanguageSwitcher, MyFooter, MyHeader },
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
