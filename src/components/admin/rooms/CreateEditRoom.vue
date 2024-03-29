<template>
  <div>
    <navigation-back />
    <p v-if="noWarehouses" class="py-4">
      {{ $t('Please, first create a warehouse') }}
    </p>
    <r-form v-else class="my-14 mx-auto w-full max-w-3xl" @submit.prevent="create">
      <r-input v-model="name" :label="$t('name')" :required="true" :disabled="loading" />
      <r-select
        v-model="warehouse"
        :label="$t('warehouse')"
        :options="warehouses"
        :required="true"
        :disable-default-option="false"
        :default-option="$t('Please, select warehouse')"
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
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import NavigationBack from '@/components/ui/NavigationBack.vue'
import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'
import RSelect from '@/components/ui/RSelect.vue'
import { createRoom, getRoom, updateRoom } from '@/services/RoomService'
import { getWarehouseOptions } from '@/services/WarehouseService'
import { useMainStore } from '@/stores/mainStore'
export default defineComponent({
  components: { RForm, RButton, RInput, RSelect, NavigationBack },
  data() {
    return {
      loading: false,
      name: '',
      warehouses: [],
      noWarehouses: false,
      warehouse: undefined
    }
  },
  computed: {
    roomId() {
      return this.$route.params.id
    },
    ...mapStores(useMainStore)
  },
  beforeMount() {
    this.fetchWarehouses()
  },
  async mounted() {
    await this.fetchData()
    await this.setTitle()
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
      this.setTitle()
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
        const options = await getWarehouseOptions()
        this.warehouses = options.data.map((option) => {
          return {
            id: option.id,
            value: option.label
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
