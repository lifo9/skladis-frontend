<template>
  <div>
    <h1 class="mt-4 mb-8 text-4xl font-bold text-gray-900 sm:truncate">
      {{ $t('My profile') }}
    </h1>
    <r-form :error="error" @submit.prevent="update" class="my-14 mx-auto w-full max-w-md">
      <image-upload :key="avatar" :label="$t('Avatar')" :disabled="loading" @change="handleAvatarChange">
        <template #image>
          <img v-if="avatar" :src="avatar" class="object-contain w-64 max-h-48 text-center" />
        </template>
      </image-upload>
      <r-input v-model="email" type="email" :label="$t('email')" required="required" :disabled="loading" />
      <r-input v-model="first_name" :label="$t('first_name')" required="required" :disabled="loading" />
      <r-input v-model="last_name" :label="$t('last_name')" required="required" :disabled="loading" />
      <r-input v-model="phone" :label="$t('phone')" :disabled="loading" />

      <r-input v-model="changePassword" type="checkbox" :one-line="true" :label="$t('Change password')" />
      <div v-if="changePassword">
        <r-input
          v-model="password"
          :required="changePassword"
          type="password"
          :label="$t('Password')"
          :enable-password-toggle="true"
        />

        <r-input
          v-model="passwordConfirmation"
          class="mt-6"
          :required="changePassword"
          type="password"
          :label="$t('Password confirmation')"
          :enable-password-toggle="true"
        />
      </div>

      <r-button type="submit" size="full" :loading="loading" :disabled="loading">
        <span>
          {{ $filters.uppercase($t('Update')) }}
        </span>
      </r-button>
    </r-form>
  </div>
</template>

<script lang="ts">
import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'
import { getMyProfile, updateMyProfile, deleteAvatar } from '@/services/MyProfileService'
import ImageUpload from '@/components/ui/ImageUpload.vue'

import { defineComponent } from 'vue'
import { useMainStore } from '@/stores/mainStore'
import { mapStores } from 'pinia'
export default defineComponent({
  components: { RForm, RButton, RInput, ImageUpload },
  data() {
    return {
      error: '',
      loading: false,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      changePassword: false,
      password: '',
      passwordConfirmation: '',
      avatar: '',
      avatarFile: undefined,
      deleteAvatar: false
    }
  },
  computed: {
    ...mapStores(useMainStore)
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const user = this.mainStore.currentUser
        for (let [key, value] of Object.entries(user)) {
          this[key] = value
        }
      } catch (error) {}
      this.loading = false
    },
    async update() {
      if (!this.validateFields()) {
        return
      }
      this.loading = true
      const password = this.changePassword ? { password: this.password } : {}
      try {
        await updateMyProfile({
          ...password,
          firstName: this.first_name,
          lastName: this.last_name,
          email: this.email,
          phone: this.phone,
          avatar: this.avatarFile
        })

        if (this.deleteAvatar) {
          await deleteAvatar()
        }

        const me = await getMyProfile()
        const userId = me.data.data.id
        const attributes = me.data.data.attributes
        const roles = me.data.included.filter((inc) => inc.type === 'role').map((role) => role.attributes.name)
        this.mainStore.setCurrentUser({
          id: userId,
          ...attributes,
          roles: roles
        })

        this.fetchData()
        this.eventBus.emit('alert', { level: 'success', message: this.$t('Your profile was successfully updated') })

        this.resetForm()
      } catch (error) {
        this.eventBus.emit('alert', { level: 'alert', message: error })
      }
      this.loading = false
    },
    handleAvatarChange(file) {
      if (!file) {
        this.deleteAvatar = true
      } else {
        this.deleteAvatar = false
      }

      this.avatarFile = file
    },
    validateFields() {
      this.error = ''
      if (this.changePassword && this.password !== this.passwordConfirmation) {
        this.error = this.$t('Passwords have to match')
        return false
      }

      return true
    },
    resetForm() {
      this.changePassword = false
      this.password = ''
      this.passwordConfirmation = ''
    }
  }
})
</script>
