<template>
  <div>
    <router-link
      class="flex items-center text-blue-600"
      :to="{ name: 'SuppliersView' }"
    >
      <span class="material-icons">arrow_back</span>
      {{ $t('Back') }}
    </router-link>
    <div class="flex flex-wrap">
      <r-form
        @submit.prevent="create"
        class="w-full max-w-xl mx-auto xl:w-2/3 my-14"
      >
        <div
          class="flex flex-wrap items-stretch justify-center space-y-6 xl:flex-nowrap xl:space-x-4 xl:space-y-0"
        >
          <div class="w-full space-y-6 xl:w-1/2 xl:space-y-2">
            <r-input
              v-model="name"
              :label="$t('name')"
              required="required"
              :disabled="loading"
            />
            <r-input
              v-model="url"
              :label="$t('url')"
              required="required"
              :disabled="loading"
            />
            <r-input
              v-model="ico"
              :label="$t('ico')"
              required="required"
              :disabled="loading"
            />
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
              :label="$t('contact')"
              :options="contacts"
              :disableDefaultOption="false"
              :defaultOption="$t('Please, select contact')"
              :value="contact_id"
              @input="setContact"
            />
          </div>
          <div class="w-full space-y-6 xl:w-1/2 xl:space-y-2">
            <r-input
              v-model="street_name"
              :label="$t('street_name')"
              required="required"
              :disabled="loading"
            />
            <r-input
              v-model="street_number"
              :label="$t('street_number')"
              required="required"
              :disabled="loading"
            />
            <r-input
              v-model="city"
              :label="$t('city')"
              required="required"
              :disabled="loading"
            />
            <r-input
              v-model="zip"
              :label="$t('zip')"
              required="required"
              :disabled="loading"
            />
            <r-input
              v-model="country"
              :label="$t('country')"
              required="required"
              :disabled="loading"
            />
          </div>
        </div>
        <r-button
          type="submit"
          size="full"
          :loading="loading"
          :disabled="loading"
        >
          <span v-if="supplierId">
            {{ $t('Update') | uppercase }}
          </span>
          <span v-else>
            {{ $t('Create') | uppercase }}
          </span>
        </r-button>
      </r-form>
      <r-map
        :key="coordinates ? coordinates.toString() : 'coordinates'"
        class="self-stretch w-full mx-auto my-4 xl:my-16 xl:w-1/3 h-96 xl:h-auto"
        :longitude="longitude"
        :latitude="latitude"
        :zoom="zoom"
        :marker="marker"
        @mapSearch="handleMapSearch"
      />
    </div>
  </div>
</template>

<script>
import RButton from '../../ui/RButton.vue'
import RForm from '../../ui/RForm.vue'
import RInput from '../../ui/RInput.vue'
import RMap from '../../ui/RMap.vue'

import { reverseGeoCode } from '../../../backend/services/MapService'
import {
  createSupplier,
  getSupplier,
  updateSupplier
} from '../../../backend/services/SupplierService'
import { getContacts } from '../../../backend/services/ContactsService'
import RSelect from '../../ui/RSelect.vue'

export default {
  components: { RMap, RForm, RInput, RButton, RSelect },
  data () {
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
  beforeMount () {
    this.fetchContacts()
  },
  mounted () {
    this.fetchData()
    this.setTitle()
  },
  updated () {
    this.setTitle()
  },
  computed: {
    longitude () {
      return this.coordinates && this.coordinates.length === 2
        ? this.coordinates[0]
        : 18.5786596
    },
    latitude () {
      return this.coordinates && this.coordinates.length === 2
        ? this.coordinates[1]
        : 48.6688592
    },
    zoom () {
      return this.coordinates && this.coordinates.length === 2 ? 16 : 3
    },
    marker () {
      return this.coordinates && this.coordinates.length === 2
    },
    supplierId () {
      return this.$route.params.id
    }
  },
  methods: {
    async create () {
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
        this.$root.$emit(
          'alert',
          'success',
          this.supplierId
            ? this.$t('Supplier was successfully updated')
            : this.$t('Supplier was successfully created')
        )
        if (!this.supplierId) {
          this.updated = true
          this.resetForm()
        }
      } catch (error) {
        this.$root.$emit('alert', 'alert', error)
      }
      this.loading = false
    },
    async fetchData () {
      this.loading = true
      if (this.supplierId) {
        try {
          const supplier = await getSupplier(this.supplierId)
          const data = supplier.data.data.attributes
          const address = supplier.data.data.relationships.address
          let addressAttributes = {}
          if (address) {
            const addressId = address.data.id
            const included = supplier.data.included.filter(
              inc => inc.type === 'address' && inc.id === addressId
            )
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
    async fetchContacts () {
      this.loading = true
      try {
        const contacts = await getContacts({ perPage: 100 }) // TODO:jf dynamic loading when paginated
        this.contacts = contacts.data.data.map(contact => {
          return {
            id: contact.id,
            value:
              contact.attributes.first_name + ' ' + contact.attributes.last_name
          }
        })
      } catch (error) {}
      this.loading = false
    },
    resetForm () {
      this.name = ''
      this.url = ''
      this.ico = ''
      this.dic = ''
      this.free_delivery_from = ''
      this.contact_id = ''
      this.street_name = ''
      this.street_number = ''
      this.city = ''
      this.zip = ''
      this.country = ''
      this.coordinates = undefined
    },
    async handleMapSearch (coordinates) {
      this.coordinates = [coordinates.x, coordinates.y]
      try {
        const details = await reverseGeoCode(
          this.coordinates[0],
          this.coordinates[1]
        )
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
    setContact (contactId) {
      this.contact_id = contactId
    },
    setTitle () {
      if (this.name) {
        this.$store.commit('setCurrentTitle', this.$t('Suppliers'))
        this.$store.commit('setCurrentSubtitle', this.name)
      }
    }
  }
}
</script>
