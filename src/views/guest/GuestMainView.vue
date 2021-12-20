<template>
  <div>
    <alert />
    <my-header />
    <main class="container max-w-6xl px-4 mx-auto md:px-12">
      <sign-in v-if="isSignIn" />
      <sign-up v-if="isSignUp" />
      <router-view />
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
import Alert from '../../components/ui/Alert.vue'

export default {
  components: {
    SignIn,
    SignUp,
    Logo,
    LanguageSwitcher,
    MyFooter,
    MyHeader,
    Alert
  },
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
