<template>
  <r-form
    @submit.prevent="signIn"
    :error="error"
    class="mx-auto my-14 w-full max-w-md"
  >
    <r-input
      v-model="email"
      required="required"
      type="email"
      :label="$t('Email address')"
      placeholder="email@example.com"
    />
    <r-input
      v-model="password"
      required="required"
      type="password"
      :label="$t('Password')"
      :placeholder="$t('Password')"
    />
    <r-button type="submit" size="full" :loading="loading">{{
      $t('Sign In')
    }}</r-button>
    <div>
      <router-link to="/sign-up">{{ $t('Sign Up') }}</router-link>
      <br />
      <router-link to="/forgot-password">{{
        $t('Forgot Password')
      }}</router-link>
    </div>
  </r-form>
</template>

<script>
import { signIn, getCurrentUser } from '../backend/services/UserService'
import RButton from './ui/RButton.vue'
import RForm from './ui/RForm.vue'
import RInput from './ui/RInput.vue'

export default {
  components: { RButton, RInput, RForm },
  data () {
    return {
      loading: false,
      email: '',
      password: '',
      error: ''
    }
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    async signIn () {
      this.loading = true
      try {
        const response = await signIn(this.email, this.password)
        this.signInSuccessful(response)
      } catch (error) {
        this.signinFailed(error)
      }
      this.loading = false
    },
    async signInSuccessful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      try {
        const me = await getCurrentUser()
        this.$store.commit('setCurrentUser', {
          currentUser: me.data,
          csrf: response.data.csrf
        })
        this.error = ''
        this.$router.replace('/')
      } catch (error) {
        this.signinFailed(error)
      }
    },
    signinFailed (error) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        ''
      this.$store.commit('unsetCurrentUser')
    },
    checkSignedIn () {
      if (this.$store.state.signedIn) {
        this.$router.replace('/')
      }
    }
  }
}
</script>