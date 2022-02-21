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
import { defineComponent } from 'vue'

import MyFooter from '@/components/MyFooter.vue'
import MyHeader from '@/components/MyHeader.vue'
import SignIn from '@/components/SignIn.vue'
import SignUp from '@/components/SignUp.vue'
import Alert from '@/components/ui/MainAlert.vue'
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
