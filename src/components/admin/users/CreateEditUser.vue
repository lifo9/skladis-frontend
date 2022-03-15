<template>
  <div>
    <navigation-back />
    <r-form :error="error" class="my-14 mx-auto w-full max-w-3xl" @submit.prevent="create">
      <file-upload
        :key="avatar != '' ? avatar : updated.toString()"
        :label="$t('Avatar')"
        :disabled="loading"
        @change="handleAvatarChange"
      >
        <template v-if="avatar" #file>
          <img :src="avatar" class="object-contain w-64 max-h-48 text-center" />
        </template>
      </file-upload>
      <r-input v-model="email" type="email" :label="$t('email')" :required="true" :disabled="loading" />
      <r-input v-model="first_name" :label="$t('first_name')" :required="true" :disabled="loading" />
      <r-input v-model="last_name" :label="$t('last_name')" :required="true" :disabled="loading" />
      <r-input v-model="phone" :label="$t('phone')" :disabled="loading" />

      <r-input v-if="userId" v-model="changePassword" type="checkbox" :one-line="true" :label="$t('Change password')" />
      <div v-if="changePassword || !userId">
        <r-input
          v-model="password"
          :required="changePassword || !userId"
          type="password"
          :label="$t('Password')"
          :enable-password-toggle="true"
        />

        <r-input
          v-model="passwordConfirmation"
          class="mt-6"
          :required="changePassword || !userId"
          type="password"
          :label="$t('Password confirmation')"
          :enable-password-toggle="true"
        />
      </div>

      <r-input v-model="active" type="checkbox" :one-line="true" :label="$filters.capitalize($t('active'))" />

      <label class="block mb-1 text-sm font-medium text-gray-800">
        {{ $filters.capitalize($t('roles')) }}
        <span class="text-red-500">*</span>
      </label>
      <multiselect
        v-model="roles"
        :options="availableRoles"
        :multiple="true"
        :taggable="true"
        :searchable="false"
        :allow-empty="false"
        :required="true"
        track-by="id"
        label="name"
        :placeholder="$t('roles')"
        :tag-placeholder="$t('roles')"
        :select-label="$t('select')"
        :selected-label="$t('deselect')"
        :deselect-label="$t('deselect')"
      />

      <r-button type="submit" size="full" :loading="loading" :disabled="loading">
        <span v-if="userId">
          {{ $filters.uppercase($t('Update')) }}
        </span>
        <span v-else>
          {{ $filters.uppercase($t('Create')) }}
        </span>
      </r-button>
    </r-form>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'
import Multiselect from 'vue-multiselect'

import FileUpload from '@/components/ui/FileUpload.vue'
import NavigationBack from '@/components/ui/NavigationBack.vue'
import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'
import { getRoles } from '@/services/RoleService'
import { createUser, deleteAvatar, getUser, updateUser } from '@/services/UsersService'
import { useMainStore } from '@/stores/mainStore'
export default defineComponent({
  components: { RForm, RButton, RInput, Multiselect, FileUpload, NavigationBack },
  data() {
    return {
      error: '',
      loading: false,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      active: undefined,
      changePassword: false,
      password: '',
      passwordConfirmation: '',
      roles: [],
      availableRoles: [],
      avatar: '',
      avatarFile: undefined,
      deleteAvatar: false,
      updated: false
    }
  },
  computed: {
    userId() {
      return this.$route.params.id
    },
    ...mapStores(useMainStore)
  },
  async mounted() {
    await this.fetchData()
    await this.setTitle()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const roles = await getRoles()
        this.availableRoles = roles.data.data.map((role) => {
          return {
            id: role.id,
            name: role.attributes.name
          }
        })

        if (this.userId) {
          const user = await getUser(this.userId)
          const data = user.data.data.attributes
          const relationships = user.data.data.relationships
          for (let [key, value] of Object.entries(data)) {
            this[key] = value
          }
          for (let [key, relationship] of Object.entries(relationships)) {
            this[key] = relationship.data
              .map((rel) => {
                if (key === 'roles') {
                  const userRoles = this.availableRoles.filter((role) => role.id === rel.id)

                  return userRoles
                }
                return rel.id
              })
              .flat()
          }
        }
      } catch (error) {}
      this.setTitle()
      this.loading = false
    },
    async create() {
      this.updated = false

      if (!this.validateFields()) {
        return
      }

      this.loading = true
      const endpoint = this.userId ? updateUser : createUser
      const password = !this.userId || this.changePassword ? { password: this.password } : {}
      try {
        if (this.deleteAvatar) {
          await deleteAvatar(this.userId)
        }

        const newUser = await endpoint({
          ...password,
          id: this.userId,
          firstName: this.first_name,
          lastName: this.last_name,
          email: this.email,
          phone: this.phone,
          active: this.active,
          roles: this.roles.map((role) => parseInt(role.id)),
          avatar: this.avatarFile
        })

        if (this.userId === this.mainStore.currentUser.id) {
          const userId = newUser.data.data.id
          const attributes = newUser.data.data.attributes
          const roles = newUser.data.included.filter((inc) => inc.type === 'role').map((role) => role.attributes.name)

          this.mainStore.setCurrentUser({
            id: userId,
            ...attributes,
            roles: roles
          })
        }

        this.eventBus.emit('alert', {
          level: 'success',
          message: this.userId ? this.$t('User was successfully updated') : this.$t('User was successfully created')
        })
        if (!this.userId) {
          this.updated = true
        }
        this.resetForm()
      } catch (error) {
        this.eventBus.emit('alert', { level: 'alert', message: error })
      }
      this.loading = false
    },
    validateFields() {
      this.error = ''
      if ((this.changePassword || !this.userId) && this.password !== this.passwordConfirmation) {
        this.error = this.$t('Passwords have to match')
        return false
      }

      if (this.roles.length === 0) {
        this.error = this.$t('Select role for the user')
        return false
      }

      return true
    },
    resetForm() {
      if (!this.userId) {
        this.first_name = ''
        this.last_name = ''
        this.email = ''
        this.phone = ''
        this.roles = []
        this.avatar = ''
        this.avatarFile = undefined
        this.deleteAvatar = false
      }
      this.changePassword = false
      this.password = ''
      this.passwordConfirmation = ''
    },
    handleAvatarChange(file) {
      if (!file) {
        this.deleteAvatar = true
      } else {
        this.deleteAvatar = false
      }

      this.avatarFile = file
    },
    setTitle() {
      if (this.email) {
        this.mainStore.setCurrentTitle(this.$t('Users'))
        this.mainStore.setCurrentSubtitle(this.email)
      }
    }
  }
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
