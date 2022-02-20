<template>
  <div>
    <router-link class="flex items-center text-blue-600" :to="{ name: 'RoomsView' }">
      <span class="material-icons">arrow_back</span>
      {{ $t('Back') }}
    </router-link>
    <p v-if="noWarehouses" class="py-4">
      {{ $t('Please, first create a warehouse') }}
    </p>
    <r-form v-else @submit.prevent="create" class="my-14 mx-auto w-full max-w-md">
      <r-input v-model="name" :label="$t('name')" required="required" :disabled="loading" />
      <r-select
        :label="$t('warehouse')"
        :options="warehouses"
        :required="true"
        :disableDefaultOption="false"
        :defaultOption="$t('Please, select warehouse')"
        :value="warehouse"
        @input="setWarehouse"
      />

      <r-button type="submit" size="full" :loading="loading" :disabled="loading || noWarehouses">
        <span v-if="roomId">
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
import { getRoom, createRoom, updateRoom } from '@/services/RoomService'
import { getWarehouses } from '@/services/WarehouseService'
import RSelect from '@/components/ui/RSelect.vue'

import { defineComponent } from 'vue'
import { useMainStore } from '@/stores/mainStore'
import { mapStores } from 'pinia'
export default defineComponent({
  components: { RForm, RButton, RInput, RSelect },
  data() {
    return {
      loading: false,
      name: '',
      warehouses: [],
      noWarehouses: false,
      warehouse: undefined
    }
  },
  beforeMount() {
    this.fetchWarehouses()
  },
  async mounted() {
    await this.fetchData()
    await this.setTitle()
  },
  updated() {
    this.setTitle()
  },
  computed: {
    roomId() {
      return this.$route.params.id
    },
    ...mapStores(useMainStore)
  },
  methods: {
    setWarehouse(warehouseId) {
      this.warehouse = warehouseId
    },
    async create() {
      if (!this.validateInputs()) {
        return
      }

      this.loading = true
      const endpoint = this.roomId ? updateRoom : createRoom
      try {
        await endpoint({
          id: this.roomId,
          name: this.name,
          warehouseId: this.warehouse
        })
        this.eventBus.emit('alert', {
          level: 'success',
          message: this.roomId ? this.$t('Room was successfully updated') : this.$t('Room was successfully created')
        })
        if (!this.roomId) {
          this.resetForm()
        }
      } catch (error) {
        this.eventBus.emit('alert', { level: 'alert', message: error })
      }
      this.loading = false
    },
    async fetchData() {
      this.loading = true
      if (this.roomId) {
        try {
          const room = await getRoom(this.roomId)
          const data = room.data.data.attributes
          const relationships = room.data.data.relationships
          for (let [key, value] of Object.entries(data)) {
            this[key] = value
          }
          for (let [key, relationship] of Object.entries(relationships)) {
            this[key] = Array.isArray(relationship.data)
              ? relationship.data
                  .map((rel) => {
                    return rel.id
                  })
                  .flat()
              : relationship.data.id
          }
        } catch (error) {}
      }
      this.loading = false
    },
    async fetchWarehouses() {
      this.loading = true
      try {
        const warehouses = await getWarehouses({ perPage: 100 }) // TODO:jf dynamic loading when paginated
        this.warehouses = warehouses.data.data.map((warehouse) => {
          return {
            id: warehouse.id,
            value: warehouse.attributes.name
          }
        })
      } catch (error) {}
      if (this.warehouses.length === 0) {
        this.noWarehouses = true
      }
      this.loading = false
    },
    validateInputs() {
      if (!this.warehouse) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select warehouse') })
        return false
      }

      return true
    },
    resetForm() {
      this.name = ''
      this.warehouse = undefined
    },
    setTitle() {
      if (this.name) {
        this.mainStore.setCurrentTitle(this.$t('Room'))
        this.mainStore.setCurrentSubtitle(this.name)
      }
    }
  }
})
</script>
