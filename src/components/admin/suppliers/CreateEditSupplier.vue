<template>
  <div>
    <navigation-back />
    <div class="flex flex-wrap">
      <r-form class="my-14 mx-auto w-full max-w-3xl xl:w-2/3" @submit.prevent="create">
        <div class="flex flex-wrap justify-center items-stretch space-y-6 xl:flex-nowrap xl:space-y-0 xl:space-x-4">
          <div class="space-y-6 w-full xl:space-y-2 xl:w-1/2">
            <r-input v-model="name" :label="$t('name')" :required="true" :disabled="loading" />
            <r-input v-model="url" :label="$t('url')" :required="true" :disabled="loading" />
            <r-input v-model="ico" :label="$t('ico')" :required="true" :disabled="loading" />
            <r-input v-model="dic" :label="$t('dic')" :disabled="loading" />
            <r-input
              v-model="free_delivery_from"
              type="number"
              step=".01"
              min="0"
              :label="$t('free_delivery_from')"
              :disabled="loading"
            />
            <r-select
              v-model="contact_id"
              :label="$t('contact')"
              :options="contacts"
              :disable-default-option="false"
              :default-option="$t('Please, select contact')"
              :value="contact_id"
            />
          </div>
          <div class="space-y-6 w-full xl:space-y-2 xl:w-1/2">
            <r-input v-model="street_name" :label="$t('street_name')" :required="true" :disabled="loading" />
            <r-input v-model="street_number" :label="$t('street_number')" :required="true" :disabled="loading" />
            <r-input v-model="city" :label="$t('city')" :required="true" :disabled="loading" />
            <r-input v-model="zip" :label="$t('zip')" :required="true" :disabled="loading" />
            <r-input v-model="country" :label="$t('country')" :required="true" :disabled="loading" />
          </div>
        </div>
        <r-button type="submit" size="full" :loading="loading" :disabled="loading">
          <span v-if="supplierId">
            {{ $filters.uppercase($t('Update')) }}
          </span>
          <span v-else>
            {{ $filters.uppercase($t('Create')) }}
          </span>
        </r-button>
      </r-form>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import NavigationBack from '@/components/ui/NavigationBack.vue'
import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'
import RSelect from '@/components/ui/RSelect.vue'
import { getContactOptions } from '@/services/ContactsService'
import { reverseGeoCode } from '@/services/MapService'
import { createSupplier, getSupplier, updateSupplier } from '@/services/SupplierService'
import { useMainStore } from '@/stores/mainStore'
export default defineComponent({
  components: { RForm, RInput, RButton, RSelect, NavigationBack },
  data() {
    return {
      loading: false,
      name: '',
      url: '',
      ico: '',
      dic: '',
      free_delivery_from: undefined,
      contacts: [],
      contact_id: undefined,
      street_name: '',
      street_number: '',
      city: '',
      zip: '',
      country: '',
      coordinates: undefined,
      updated: false
    }
  },
  computed: {
    longitude() {
      return this.coordinates && this.coordinates.length === 2 ? this.coordinates[0] : 18.5786596
    },
    latitude() {
      return this.coordinates && this.coordinates.length === 2 ? this.coordinates[1] : 48.6688592
    },
    zoom() {
      return this.coordinates && this.coordinates.length === 2 ? 16 : 3
    },
    marker() {
      return this.coordinates && this.coordinates.length === 2
    },
    supplierId() {
      return this.$route.params.id
    },
    ...mapStores(useMainStore)
  },
  beforeMount() {
    this.fetchContacts()
  },
  async mounted() {
    await this.fetchData()
    await this.setTitle()
  },
  methods: {
    async create() {
      this.loading = true
      this.updated = false

      const endpoint = this.supplierId ? updateSupplier : createSupplier
      try {
        await endpoint({
          id: this.supplierId,
          name: this.name,
          url: this.url,
          ico: this.ico,
          dic: this.dic,
          contactId: this.contact_id,
          freeDeliveryFrom: this.free_delivery_from,
          streetName: this.street_name,
          streetNumber: this.street_number,
          city: this.city,
          zip: this.zip,
          country: this.country,
          coordinates: this.coordinates
        })
        this.eventBus.emit('alert', {
          level: 'success',
          message: this.supplierId
            ? this.$t('Supplier was successfully updated')
            : this.$t('Supplier was successfully created')
        })
        if (!this.supplierId) {
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
      if (this.supplierId) {
        try {
          const supplier = await getSupplier(this.supplierId)
          const data = supplier.data.data.attributes
          const address = supplier.data.data.relationships.address
          let addressAttributes = {}
          if (address) {
            const addressId = address.data.id
            const included = supplier.data.included.filter((inc) => inc.type === 'address' && inc.id === addressId)
            if (included && included.length === 1) {
              addressAttributes = included[0].attributes
            }
          }
          for (let [key, value] of Object.entries({
            ...data,
            ...addressAttributes
          })) {
            this[key] = value
          }
        } catch (error) {}
      }
      this.loading = false
    },
    async fetchContacts() {
      this.loading = true
      try {
        const options = await getContactOptions()
        this.contacts = options.data.map((option) => {
          return {
            id: option.id,
            value: option.label
          }
        })
      } catch (error) {}
      this.loading = false
    },
    resetForm() {
      this.name = ''
      this.url = ''
      this.ico = ''
      this.dic = ''
      this.free_delivery_from = undefined
      this.contact_id = undefined
      this.street_name = ''
      this.street_number = ''
      this.city = ''
      this.zip = ''
      this.country = ''
      this.coordinates = undefined
    },
    async handleMapSearch(coordinates) {
      this.coordinates = [coordinates.x, coordinates.y]
      try {
        const details = await reverseGeoCode(this.coordinates[0], this.coordinates[1])
        if (details.data && details.data.address) {
          const address = details.data.address
          this.country = address.country ? address.country : ''
          this.city = address.city ? address.city : ''
          this.zip = address.postcode ? address.postcode : ''
          this.street_name = address.road ? address.road : ''
          this.street_number = address.house_number ? address.house_number : ''
        }
      } catch (_) {
        // do nothing
      }
    },
    setTitle() {
      if (this.name) {
        this.mainStore.setCurrentTitle(this.$t('Suppliers'))
        this.mainStore.setCurrentSubtitle(this.name)
      }
    }
  }
})
</script>
