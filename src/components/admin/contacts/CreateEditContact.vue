<template>
  <div>
    <navigation-back />
    <r-form class="my-14 mx-auto w-full max-w-3xl" @submit.prevent="create">
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
      <r-input v-model="first_name" :label="$t('first_name')" :required="true" :disabled="loading" />
      <r-input v-model="last_name" :label="$t('last_name')" :required="true" :disabled="loading" />
      <r-input v-model="email" type="email" :label="$t('email')" :required="true" :disabled="loading" />
      <r-input v-model="phone" :label="$t('phone')" :required="true" :disabled="loading" />

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
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import FileUpload from '@/components/ui/FileUpload.vue'
import NavigationBack from '@/components/ui/NavigationBack.vue'
import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'
import { createContact, deleteAvatar, getContact, updateContact } from '@/services/ContactsService'
import { useMainStore } from '@/stores/mainStore'
export default defineComponent({
  components: { RForm, RButton, RInput, FileUpload, NavigationBack },
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
  computed: {
    contactId() {
      return this.$route.params.id
    },
    ...mapStores(useMainStore)
  },
  async mounted() {
    await this.fetchData()
    await this.setTitle()
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
        this.eventBus.emit('alert', {
          level: 'success',
          message: this.contactId
            ? this.$t('Contact was successfully updated')
            : this.$t('Contact was successfully created')
        })
        if (!this.contactId) {
          this.updated = true
          this.resetForm()
        }
      } catch (error) {
        this.eventBus.emit('alert', { level: 'alert', message: error })
      }
      this.setTitle()
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
        this.mainStore.setCurrentTitle(this.$t('Contacts'))
        this.mainStore.setCurrentSubtitle(this.email)
      }
    }
  }
})
</script>
