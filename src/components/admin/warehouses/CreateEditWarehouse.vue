<template>
  <div>
    <router-link
      class="flex items-center text-blue-600"
      :to="{ name: 'WarehousesView' }"
    >
      <span class="material-icons">arrow_back</span>
      {{ $t('Back') }}
    </router-link>
    <div class="flex flex-wrap">
      <r-form
        @submit.prevent="create"
        class="w-full max-w-md mx-auto xl:w-1/2 my-14"
      >
        <r-input
          v-model="name"
          :label="$t('name')"
          required="required"
          :disabled="loading"
        />
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
          v-model="country"
          :label="$t('country')"
          required="required"
          :disabled="loading"
        />

        <r-button
          type="submit"
          size="full"
          :loading="loading"
          :disabled="loading"
        >
          <span v-if="warehouseId">
            {{ $t('Update') | uppercase }}
          </span>
          <span v-else>
            {{ $t('Create') | uppercase }}
          </span>
        </r-button>
      </r-form>
      <r-map
        :key="coordinates ? coordinates.toString() : 'coordinates'"
        class="self-stretch w-full mx-auto my-4 xl:my-16 xl:w-1/2 h-96 xl:h-auto"
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
  createWarehouse,
  getWarehouse,
  updateWarehouse
} from '../../../backend/services/WarehouseService'

export default {
  components: { RMap, RForm, RInput, RButton },
  data () {
    return {
      loading: false,
      name: '',
      street_name: '',
      street_number: '',
      city: '',
      country: '',
      coordinates: undefined,
      updated: false
    }
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
    warehouseId () {
      return this.$route.params.id
    }
  },
  methods: {
    async create () {
      this.loading = true
      this.updated = false

      const endpoint = this.warehouseId ? updateWarehouse : createWarehouse
      try {
        await endpoint({
          id: this.warehouseId,
          name: this.name,
          streetName: this.street_name,
          streetNumber: this.street_number,
          city: this.city,
          country: this.country,
          coordinates: this.coordinates
        })
        this.$root.$emit(
          'alert',
          'success',
          this.warehouseId
            ? this.$t('Warehouse was successfully updated')
            : this.$t('Warehouse was successfully created')
        )
        if (!this.warehouseId) {
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
      if (this.warehouseId) {
        try {
          const warehouse = await getWarehouse(this.warehouseId)
          const data = warehouse.data.data.attributes
          for (let [key, value] of Object.entries(data)) {
            this[key] = value
          }
        } catch (error) {}
      }
      this.loading = false
    },
    resetForm () {
      this.name = ''
      this.street_name = ''
      this.street_number = ''
      this.city = ''
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
          this.street_name = address.road ? address.road : ''
          this.street_number = address.house_number ? address.house_number : ''
        }
      } catch (_) {
        // do nothing
      }
    },
    setTitle () {
      if (this.email) {
        this.$store.commit(
          'setCurrentTitle',
          this.$t('Warehouses') + ' - ' + this.name
        )
      }
    }
  }
}
</script>
