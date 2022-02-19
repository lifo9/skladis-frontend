<template>
  <div>
    <alert />
    <my-header />
    <main class="container px-4 mx-auto max-w-6xl md:px-12">
      <sign-in v-if="isSignIn" />
      <sign-up v-if="isSignUp" />
      <router-view />
    </main>
    <my-footer class="fixed" />
  </div>
</template>

<script lang="ts">
import SignIn from '@/components/SignIn.vue'
import SignUp from '@/components/SignUp.vue'
import MyFooter from '@/components/Footer.vue'
import MyHeader from '@/components/Header.vue'
import Alert from '@/components/ui/Alert.vue'

import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    SignIn,
    SignUp,
    MyFooter,
    MyHeader,
    Alert
  },
  computed: {
    isSignIn() {
      return this.$route.name === 'SignIn'
    },
    isSignUp() {
      return this.$route.name === 'SignUp'
    }
  }
})
</script>
