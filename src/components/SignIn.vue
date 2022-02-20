<template>
  <r-form :error="error" @submit.prevent="signIn" class="my-14 mx-auto w-full max-w-md">
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
    <r-button type="submit" size="full" :loading="loading" :disabled="loading">
      {{ $t('Sign In') }}
    </r-button>
  </r-form>
</template>

<script lang="ts">
import { signIn } from '@/services/UserService'
import { getMyProfile } from '@/services/MyProfileService'
import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'

import { defineComponent } from 'vue'
import { useMainStore } from '@/stores/mainStore'
import { mapStores } from 'pinia'
export default defineComponent({
  components: { RButton, RInput, RForm },
  data() {
    return {
      loading: false,
      email: '',
      password: '',
      error: ''
    }
  },
  computed: {
    ...mapStores(useMainStore)
  },
  created() {
    this.checkSignedIn()
  },
  updated() {
    this.checkSignedIn()
  },
  methods: {
    async signIn() {
      this.loading = true
      try {
        const response = await signIn(this.email, this.password)
        this.signInSuccessful(response)
      } catch (error) {
        this.signinFailed(error)
      }
      this.loading = false
    },
    async signInSuccessful(response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      try {
        const me = await getMyProfile()
        const userId = me.data.data.id
        const attributes = me.data.data.attributes
        const roles = me.data.included.filter((inc) => inc.type === 'role').map((role) => role.attributes.name)

        this.mainStore.setLoggedInUser(
          {
            id: userId,
            ...attributes,
            roles: roles
          },
          response.data.csrf
        )
        this.error = ''
        this.$router.replace('/')
      } catch (error) {
        this.signinFailed(error)
      }
    },
    signinFailed(error) {
      this.error = (error.response && error.response.data && error.response.data.error) || ''
      this.mainStore.unsetCurrentUser()
    },
    checkSignedIn() {
      if (this.mainStore.signedIn) {
        this.$router.replace('/')
      }
    }
  }
})
</script>
