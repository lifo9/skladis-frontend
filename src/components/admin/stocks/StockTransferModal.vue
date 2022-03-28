<template>
  <div>
    <r-button
      size="verySmall"
      class="m-1 bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-400 focus:border-yellow-700"
      @click="showModal = true"
    >
      <span class="mr-1 material-icons">compare_arrows</span>
      {{ $filters.uppercase($t('Stocks transfer')) }}
    </r-button>
    <div>
      <vue-final-modal v-model="showModal" classes="modal-container">
        <div class="flex flex-wrap justify-center items-center p-8 m-4 max-w-xl bg-white rounded-md">
          <div v-if="!loading" class="flex flex-wrap justify-center my-4 w-full">
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
            <p class="mb-2 w-full text-base text-center">
              <crud-text :row="row" :included="included" :options="{ relationship: 'room', attribute: ['name'] }" />
            </p>
            <p class="mb-10 w-full text-base text-center">
              {{ $filters.capitalize($t('expiration')) }}:
              <crud-text
                :row="row"
                :included="included"
                :options="{ attribute: 'expiration', format: $filters.formatDate }"
              />
            </p>
            <div class="mb-8 space-y-2 w-full max-w-sm">
              <label class="block mb-1 text-sm font-medium text-gray-800">
                {{ $filters.capitalize($t('To room')) }}
                <span class="text-red-500">*</span>
              </label>
              <multiselect
                v-model="roomTo"
                track-by="id"
                label="label"
                :options="roomOptions"
                :searchable="true"
                :placeholder="$t('Room')"
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
          <r-spinner v-else class="mr-3 ml-1 w-24 h-24 text-gray-300" />
          <div class="flex justify-between space-x-4 w-full align-middle">
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
import { getRoomOptions } from '@/services/RoomService'
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
      loading: true,
      showModal: false,
      roomOptions: undefined,
      roomTo: undefined,
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
    expiration() {
      return this.row.attributes.expiration
    }
  },
  mounted() {
    this.fetchRoomOptions()
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
          roomToId: this.roomTo.id,
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

      return true
    },
    async fetchRoomOptions() {
      this.loading = true

      const rooms = await getRoomOptions()

      this.roomOptions = rooms.data
        .map((room) => {
          return { id: room.id, label: room.label }
        })
        .filter((room) => room.id !== this.roomId)

      if (this.roomOptions.length === 1) {
        this.roomTo = this.roomOptions[0]
      }

      this.loading = false
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
