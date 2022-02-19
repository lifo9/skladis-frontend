<template>
  <div>
    <router-link class="flex items-center text-blue-600" :to="{ name: 'ContactsView' }">
      <span class="material-icons">arrow_back</span>
      {{ $t('Back') }}
    </router-link>
    <r-form @submit.prevent="create" class="my-14 mx-auto w-full max-w-md">
      <image-upload
        :key="avatar != '' ? avatar : updated.toString()"
        :label="$t('Avatar')"
        :disabled="loading"
        @change="handleAvatarChange"
      >
        <template v-slot:image>
          <img v-if="avatar" :src="avatar" class="object-contain w-64 max-h-48 text-center" />
        </template>
      </image-upload>
      <r-input v-model="first_name" :label="$t('first_name')" required="required" :disabled="loading" />
      <r-input v-model="last_name" :label="$t('last_name')" required="required" :disabled="loading" />
      <r-input v-model="email" type="email" :label="$t('email')" required="required" :disabled="loading" />
      <r-input v-model="phone" :label="$t('phone')" required="required" :disabled="loading" />

      <r-button type="submit" size="full" :loading="loading" :disabled="loading">
        <span v-if="contactId">
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
import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'
import { getContact, createContact, updateContact, deleteAvatar } from '@/services/ContactsService'
import ImageUpload from '@/components/ui/ImageUpload.vue'

import { defineComponent } from 'vue'
export default defineComponent({
  components: { RForm, RButton, RInput, ImageUpload },
  data() {
    return {
      loading: false,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      avatar: '',
      avatarFile: undefined,
      deleteAvatar: false,
      updated: false
    }
  },
  mounted() {
    this.fetchData()
    this.setTitle()
  },
  updated() {
    this.setTitle()
  },
  computed: {
    contactId() {
      return this.$route.params.id
    }
  },
  methods: {
    async create() {
      this.loading = true
      this.updated = false

      const endpoint = this.contactId ? updateContact : createContact
      try {
        if (this.deleteAvatar) {
          await deleteAvatar(this.contactId)
        }

        await endpoint({
          id: this.contactId,
          firstName: this.first_name,
          lastName: this.last_name,
          email: this.email,
          phone: this.phone,
          avatar: this.avatarFile
        })
        this.eventBus.emit(
          'alert',
          'success',
          this.contactId ? this.$t('Contact was successfully updated') : this.$t('Contact was successfully created')
        )
        if (!this.contactId) {
          this.updated = true
          this.resetForm()
        }
      } catch (error) {
        this.eventBus.emit('alert', 'alert', error)
      }
      this.loading = false
    },
    async fetchData() {
      this.loading = true
      if (this.contactId) {
        try {
          const contact = await getContact(this.contactId)
          const data = contact.data.data.attributes
          for (let [key, value] of Object.entries(data)) {
            this[key] = value
          }
        } catch (error) {}
      }
      this.loading = false
    },
    resetForm() {
      this.first_name = ''
      this.last_name = ''
      this.email = ''
      this.phone = ''
      this.avatar = ''
      this.avatarFile = undefined
      this.deleteAvatar = false
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
        this.$store.commit('setCurrentTitle', this.$t('Contacts'))
        this.$store.commit('setCurrentSubtitle', this.email)
      }
    }
  }
})
</script>
