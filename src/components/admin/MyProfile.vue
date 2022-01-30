<template>
  <div>
    <h1 class="mt-4 mb-8 text-4xl font-bold text-gray-900 sm:truncate">
      {{ $t('My profile') }}
    </h1>
    <r-form
      @submit.prevent="update"
      :error="error"
      class="w-full max-w-md mx-auto my-14"
    >
      <image-upload
        :key="avatar"
        :label="$t('Avatar')"
        :disabled="loading"
        @change="handleAvatarChange"
      >
        <template v-slot:image>
          <img
            v-if="avatar"
            :src="avatar"
            class="object-contain w-64 text-center max-h-48"
          />
        </template>
      </image-upload>
      <r-input
        v-model="email"
        type="email"
        :label="$t('email')"
        required="required"
        :disabled="loading"
      />
      <r-input
        v-model="first_name"
        :label="$t('first_name')"
        required="required"
        :disabled="loading"
      />
      <r-input
        v-model="last_name"
        :label="$t('last_name')"
        required="required"
        :disabled="loading"
      />
      <r-input v-model="phone" :label="$t('phone')" :disabled="loading" />

      <r-input
        v-model="changePassword"
        type="checkbox"
        :one-line="true"
        :label="$t('Change password')"
      />
      <div v-if="changePassword">
        <r-input
          v-model="password"
          :required="changePassword"
          type="password"
          :label="$t('Password')"
          :enablePasswordToggle="true"
        />

        <r-input
          class="mt-6"
          v-model="passwordConfirmation"
          :required="changePassword"
          type="password"
          :label="$t('Password confirmation')"
          :enablePasswordToggle="true"
        />
      </div>

      <r-button
        type="submit"
        size="full"
        :loading="loading"
        :disabled="loading"
      >
        <span>
          {{ $t('Update') | uppercase }}
        </span>
      </r-button>
    </r-form>
  </div>
</template>

<script>
import RButton from '../ui/RButton.vue'
import RForm from '../ui/RForm.vue'
import RInput from '../ui/RInput.vue'
import {
  getMyProfile,
  updateMyProfile,
  deleteAvatar
} from '../../backend/services/MyProfileService'
import ImageUpload from '../ui/ImageUpload.vue'

export default {
  components: { RForm, RButton, RInput, ImageUpload },
  data () {
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
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true
      try {
        const user = this.$store.state.currentUser
        for (let [key, value] of Object.entries(user)) {
          this[key] = value
        }
      } catch (error) {}
      this.loading = false
    },
    async update () {
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
        const roles = me.data.included
          .filter(inc => inc.type === 'role')
          .map(role => role.attributes.name)
        this.$store.commit('setCurrentUser', {
          currentUser: {
            id: userId,
            ...attributes,
            roles: roles
          }
        })

        this.fetchData()
        this.$root.$emit(
          'alert',
          'success',
          this.$t('Your profile was successfully updated')
        )

        this.resetForm()
      } catch (error) {
        this.$root.$emit('alert', 'alert', error)
      }
      this.loading = false
    },
    handleAvatarChange (file) {
      if (!file) {
        this.deleteAvatar = true
      } else {
        this.deleteAvatar = false
      }

      this.avatarFile = file
    },
    validateFields () {
      this.error = ''
      if (this.changePassword && this.password !== this.passwordConfirmation) {
        this.error = this.$t('Passwords have to match')
        return false
      }

      return true
    },
    resetForm () {
      this.changePassword = false
      this.password = ''
      this.passwordConfirmation = ''
    }
  }
}
</script>
