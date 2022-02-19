<template>
  <div>
    <router-link class="flex items-center text-blue-600" :to="{ name: 'VendorsView' }">
      <span class="material-icons">arrow_back</span>
      {{ $t('Back') }}
    </router-link>
    <r-form @submit.prevent="create" class="my-14 mx-auto w-full max-w-md">
      <image-upload
        :key="logo != '' ? logo : updated.toString()"
        :label="$t('Logo')"
        :disabled="loading"
        @change="handleLogoChange"
      >
        <template v-slot:image>
          <img v-if="logo" :src="logo" class="object-contain w-64 max-h-48 text-center" />
        </template>
      </image-upload>
      <r-input v-model="name" :label="$t('name')" required="required" :disabled="loading" />
      <r-input v-model="url" :label="$t('url')" required="required" :disabled="loading" />

      <r-button type="submit" size="full" :loading="loading" :disabled="loading">
        <span v-if="vendorId">
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
import { getVendor, createVendor, updateVendor, deleteLogo } from '@/services/VendorService'
import ImageUpload from '@/components/ui/ImageUpload.vue'

import { defineComponent } from 'vue'
export default defineComponent({
  components: { RForm, RButton, RInput, ImageUpload },
  data() {
    return {
      loading: false,
      name: '',
      url: '',
      logo: '',
      logoFile: undefined,
      deleteLogo: false,
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
    vendorId() {
      return this.$route.params.id
    }
  },
  methods: {
    async create() {
      this.loading = true
      this.updated = false

      const endpoint = this.vendorId ? updateVendor : createVendor
      try {
        if (this.deleteLogo) {
          await deleteLogo(this.vendorId)
        }

        await endpoint({
          id: this.vendorId,
          name: this.name,
          url: this.url,
          logo: this.logoFile
        })
        this.eventBus.emit(
          'alert',
          'success',
          this.vendorId ? this.$t('Vendor was successfully updated') : this.$t('Vendor was successfully created')
        )
        if (!this.vendorId) {
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
      if (this.vendorId) {
        try {
          const vendor = await getVendor(this.vendorId)
          const data = vendor.data.data.attributes
          for (let [key, value] of Object.entries(data)) {
            this[key] = value
          }
        } catch (error) {}
      }
      this.loading = false
    },
    resetForm() {
      this.name = ''
      this.url = ''
      this.logo = ''
      this.logoFile = undefined
      this.deleteLogo = false
    },
    handleLogoChange(file) {
      if (!file) {
        this.deleteLogo = true
      } else {
        this.deleteLogo = false
      }

      this.logoFile = file
    },
    setTitle() {
      if (this.email) {
        this.$store.commit('setCurrentTitle', this.$t('Vendors'))
        this.$store.commit('setCurrentSubtitle', this.email)
      }
    }
  }
})
</script>
