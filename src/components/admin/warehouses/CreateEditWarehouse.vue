<template>
  <div>
    <navigation-back />
    <div class="flex flex-wrap">
      <r-form class="my-14 mx-auto w-full max-w-3xl xl:w-1/2" @submit.prevent="create">
        <r-input v-model="name" :label="$t('name')" :required="true" :disabled="loading" />
        <r-input v-model="street_name" :label="$t('street_name')" :required="true" :disabled="loading" />
        <r-input v-model="street_number" :label="$t('street_number')" :required="true" :disabled="loading" />
        <r-input v-model="city" :label="$t('city')" :required="true" :disabled="loading" />
        <r-input v-model="zip" :label="$t('zip')" :required="true" :disabled="loading" />
        <r-input v-model="country" :label="$t('country')" :required="true" :disabled="loading" />

        <r-button type="submit" size="full" :loading="loading" :disabled="loading">
          <span v-if="warehouseId">
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
import { reverseGeoCode } from '@/services/MapService'
import { createWarehouse, getWarehouse, updateWarehouse } from '@/services/WarehouseService'
import { useMainStore } from '@/stores/mainStore'
export default defineComponent({
  components: { RForm, RInput, RButton, NavigationBack },
  data() {
    return {
      loading: false,
      name: '',
      address_id: undefined,
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
    warehouseId() {
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

      const endpoint = this.warehouseId ? updateWarehouse : createWarehouse
      try {
        await endpoint({
          id: this.warehouseId,
          name: this.name,
          addressId: this.address_id,
          streetName: this.street_name,
          streetNumber: this.street_number,
          city: this.city,
          zip: this.zip,
          country: this.country,
          coordinates: this.coordinates
        })
        this.eventBus.emit('alert', {
          level: 'success',
          message: this.warehouseId
            ? this.$t('Warehouse was successfully updated')
            : this.$t('Warehouse was successfully created')
        })
        if (!this.warehouseId) {
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
      if (this.warehouseId) {
        try {
          const warehouse = await getWarehouse(this.warehouseId)
          const data = warehouse.data.data.attributes
          const address = warehouse.data.data.relationships.address
          let addressAttributes = {}
          if (address) {
            const addressId = address.data.id
            this.address_id = addressId
            const included = warehouse.data.included.filter((inc) => inc.type === 'address' && inc.id === addressId)
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
    resetForm() {
      this.name = ''
      this.address_id = undefined
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
      if (this.email) {
        this.mainStore.setCurrentTitle(this.$t('Warehouses'))
        this.mainStore.setCurrentSubtitle(this.name)
      }
    }
  }
})
</script>
