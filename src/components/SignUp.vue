<template>
  <div>
    <h1 class="my-4 text-3xl text-center">{{ $t('Registration') }}</h1>
    <p class="flex items-center text-blue-600">
      <span class="material-icons">arrow_back</span>
      <router-link to="/sign-in">{{ $t('Sign In') }}</router-link>
    </p>
    <r-form :error="error" class="my-14 mx-auto w-full max-w-md" @submit.prevent="signUp">
      <r-input
        v-model="email"
        :required="true"
        type="email"
        :label="$t('Email address')"
        placeholder="email@example.com"
      />
      <r-input
        v-model="password"
        :required="true"
        type="password"
        :label="$t('Password')"
        :placeholder="$t('Password')"
        :enable-password-toggle="true"
      />
      <r-input
        v-model="passwordConfirmation"
        :required="true"
        type="password"
        :label="$t('Password confirmation')"
        :placeholder="$t('Password')"
        :enable-password-toggle="true"
      />
      <r-input v-model="firstName" :required="true" :label="$t('First name')" :placeholder="$t('First name')" />
      <r-input v-model="lastName" :required="true" :label="$t('Last name')" :placeholder="$t('Last name')" />
      <r-button type="submit" size="full" :loading="loading" :disabled="loading">{{ $t('Sign Up') }}</r-button>
    </r-form>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'
import { signUp } from '@/services/UserService'
import { useMainStore } from '@/stores/mainStore'
export default defineComponent({
  components: { RButton, RInput, RForm },
  data() {
    return {
      loading: false,
      email: '',
      password: '',
      passwordConfirmation: '',
      firstName: '',
      lastName: '',
      registrationKey: this.$route.params.registration_key,
      error: ''
    }
  },
  computed: {
    ...mapStores(useMainStore)
  },
  created() {
    this.checkSignedIn()
  },
  methods: {
    async signUp() {
      this.loading = true

      try {
        if (this.validateFields()) {
          await signUp(
            this.email,
            this.password,
            this.passwordConfirmation,
            this.firstName,
            this.lastName,
            this.registrationKey
          )
          this.signUpSuccess()
        }
      } catch (error) {
        this.signUpFailed(error)
      }

      this.loading = false
    },
    signUpSuccess() {
      this.email = this.password = this.passwordConfirmation = this.firstName = this.lastName = ''

      this.eventBus.emit('alert', { level: 'success', message: this.$t('Registration successful message') })
    },
    signUpFailed(error) {
      this.error = (error.response && error.response.data && error.response.data.error) || ''
    },
    validateFields() {
      this.error = ''
      if (this.password !== this.passwordConfirmation) {
        this.error = this.$t('Passwords have to match')
        return false
      }

      return true
    },
    checkSignedIn() {
      if (this.mainStore.signedIn) {
        this.$router.replace('/')
      }
    }
  }
})
</script>
