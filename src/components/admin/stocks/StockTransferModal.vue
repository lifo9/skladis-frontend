<template>
  <div>
    <r-button
      size="verySmall"
      class="m-1 bg-yellow-600 hover:bg-yellow-500 focus:border-yellow-700 active:bg-yellow-400"
      @click="showModal = true"
    >
      <span class="material-icons mr-1">compare_arrows</span>
      {{ $filters.uppercase($t('Stocks transfer')) }}
    </r-button>
    <div>
      <vue-final-modal v-model="showModal" classes="modal-container">
        <div class="m-4 flex max-w-xl flex-wrap items-center justify-center rounded-md bg-white p-8">
          <div v-if="!loading" class="my-4 flex w-full flex-wrap justify-center">
            <h1 class="mb-10 w-full text-center">{{ $t('Stocks transfer heading') }}</h1>
            <h2 class="mb-2 w-full text-center">
              <b>
                <crud-text
                  :row="row"
                  :included="included"
                  :options="{ relationship: 'product', attribute: ['name'] }"
                />
              </b>
            </h2>
            <p class="mb-2 w-full text-center text-base">
              <crud-text :row="row" :included="included" :options="{ relationship: 'room', attribute: ['name'] }" />
            </p>
            <p class="mb-2 w-full text-center text-base">
              <crud-text :row="row" :included="included" :options="{ relationship: 'location', attribute: ['name'] }" />
            </p>
            <p class="mb-10 w-full text-center text-base">
              {{ $filters.capitalize($t('expiration')) }}:
              <crud-text
                :row="row"
                :included="included"
                :options="{ attribute: 'expiration', format: $filters.formatDate }"
              />
            </p>
            <div class="mb-8 w-full max-w-sm space-y-2">
              <label class="mb-1 block text-sm font-medium text-gray-800">
                {{ $filters.capitalize($t('To room')) }}
                <span class="text-red-500">*</span>
              </label>
              <multiselect
                v-model="roomTo"
                track-by="id"
                label="label"
                :options="filteredRoomOptions"
                :searchable="true"
                :placeholder="$t('Room')"
                :select-label="$t('select')"
                :selected-label="$t('deselect')"
                :deselect-label="$t('deselect')"
                :no-options="$t('Not found')"
                :show-no-results="false"
              />
              <label class="mb-1 block text-sm font-medium text-gray-800">
                {{ $filters.capitalize($t('To location')) }}
                <span class="text-red-500">*</span>
              </label>
              <multiselect
                v-model="locationTo"
                track-by="id"
                label="label"
                :options="filteredLocationOptions"
                :searchable="true"
                :placeholder="$t('location')"
                :select-label="$t('select')"
                :selected-label="$t('deselect')"
                :deselect-label="$t('deselect')"
                :no-options="$t('Not found')"
                :show-no-results="false"
              />
              <r-input
                v-model="quantity"
                class="w-40"
                :placeholder="$t('quantity')"
                type="number"
                step="1"
                min="1"
                :required="true"
                :label="$filters.capitalize($t('quantity'))"
              />
            </div>
          </div>
          <r-spinner v-else class="mr-3 ml-1 h-24 w-24 text-gray-300" />
          <div class="flex w-full justify-between space-x-4 align-middle">
            <r-button variant="secondary" @click="showModal = false">
              {{ $t('Cancel') }}
            </r-button>
            <r-button variant="danger" @click="stockTransfer">
              {{ $t('OK') }}
            </r-button>
          </div>
        </div>
      </vue-final-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Multiselect from 'vue-multiselect'

import CrudText from '@/components/CrudText.vue'
import RButton from '@/components/ui/RButton.vue'
import RInput from '@/components/ui/RInput.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { stockTransfer } from '@/services/StockService'

export default defineComponent({
  components: { RButton, RInput, CrudText, RSpinner, Multiselect },
  props: {
    options: {
      type: Object,
      default: undefined
    },
    row: {
      type: Object,
      required: true
    },
    included: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      loading: false,
      showModal: false,
      roomOptions: undefined,
      roomTo: undefined,
      locationOptions: undefined,
      locationTo: undefined,
      quantity: 1
    }
  },
  computed: {
    stockId() {
      return this.row.id
    },
    productId() {
      return parseInt(this.row.relationships.product.data.id)
    },
    roomId() {
      return parseInt(this.row.relationships.room.data.id)
    },
    locationId() {
      return parseInt(this.row.relationships?.location?.data?.id)
    },
    expiration() {
      return this.row.attributes.expiration
    },
    filteredRoomOptions() {
      const rooms = this.options.roomOptions
      const selectedLocation = this.options.locationOptions.filter((location) => location.id == this.locationTo?.id)
      if (selectedLocation.length > 0) {
        return rooms.filter((room) => room.id != selectedLocation[0].room_id)
      } else {
        return rooms
      }
    },
    filteredLocationOptions() {
      const locations = this.options.locationOptions.filter((location) => location.id !== this.locationId)
      const selectedRoom = this.options.roomOptions.filter((room) => room.id == this.roomTo?.id)

      if (selectedRoom.length > 0) {
        return locations.filter((location) => selectedRoom[0].location_ids.includes(location.id))
      } else {
        return locations
      }
    }
  },
  mounted() {
    if (this.filteredRoomOptions.length === 1) {
      this.locationTo = this.filteredRoomOptions[0]
    }
    if (this.filteredLocationOptions.length === 1) {
      this.locationTo = this.filteredLocationOptions[0]
    }
  },
  methods: {
    async stockTransfer() {
      if (!this.validate()) {
        return
      }

      try {
        await stockTransfer({
          productId: this.productId,
          roomFromId: this.roomId,
          locationFromId: this.locationId,
          roomToId: this.roomTo.id,
          locationToId: this.locationTo.id,
          expiration: this.expiration,
          quantity: parseInt(this.quantity)
        })

        this.eventBus.emit('alert', {
          level: 'success',
          message: this.$t('Stock transfer was successfull')
        })
        this.eventBus.emit('reloadCrudTable')
        this.showModal = false
      } catch (error) {
        this.eventBus.emit('alert', {
          level: 'alert',
          message: this.$t('Insufficient stocks')
        })
      }
    },
    validate() {
      if (!this.quantity) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select quantity') })
        return false
      }
      if (!this.roomTo) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select room') })
        return false
      }
      if (!this.locationTo) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select location') })
        return false
      }

      return true
    }
  }
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style lang="postcss" scoped>
:deep(.modal-container) {
  @apply flex justify-center items-center overflow-hidden z-50;
}
.modal__close {
  @apply absolute top-2 right-2;
}
</style>
