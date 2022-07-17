<template>
  <r-button
    v-if="!row.attributes.stocked_in"
    class="mx-2"
    variant="success"
    size="verySmall"
    :loading="loading"
    @click="showModal = true"
  >
    <span class="material-icons mr-2">add</span>
    {{ $filters.uppercase($t('InvoiceToStock')) }}
  </r-button>
  <vue-final-modal v-model="showModal" classes="modal-container">
    <div
      class="relative m-4 flex min-h-[75vh] max-w-6xl flex-wrap items-center justify-center rounded-md bg-white p-4 md:min-w-[70vw] md:p-8"
    >
      <div class="my-4 flex h-[75vh] w-full flex-wrap justify-center self-baseline overflow-auto">
        <r-spinner v-if="loading" class="mr-3 ml-1 h-24 w-24 text-gray-300" />
        <div v-else class="h-full w-full">
          <h1 class="mb-6 text-center">{{ invoice_code }} - {{ $filters.formatDate(invoice_date) }}</h1>
          <div
            class="relative mb-4 hidden items-start space-y-4 space-x-2 border-b text-sm font-semibold md:grid md:grid-cols-8 md:space-y-0"
          >
            <div class="col-span-2">{{ $filters.uppercase($t('Product')) }}</div>
            <div class="col-span-2">{{ $filters.uppercase($t('Room')) }}</div>
            <div class="col-span-2">{{ $filters.uppercase($t('location')) }}</div>
            <div class="text-center">{{ $filters.uppercase($t('expiration')) }}</div>
            <div class="text-center">{{ $filters.uppercase($t('quantity')) }}</div>
          </div>
          <div class="w-full space-y-4 divide-y md:divide-y-0">
            <invoice-to-stock-item
              v-for="invoiceItem in invoiceItems"
              :key="invoiceItem.id"
              :invoice-item-id="invoiceItem.id"
              class="overflow-x-clip"
              :product-id="invoiceItem.product_id"
              :product-name="invoiceItem.product_name"
              :quantity="invoiceItem.quantity"
              :room-options="roomOptions"
              :location-options="locationOptions"
              @stock-item-change="handleStockItemChange"
            />
          </div>
        </div>
      </div>
      <div class="flex w-full max-w-md justify-between space-x-4 self-end align-middle">
        <r-button variant="secondary" @click="showModal = false">
          {{ $t('Cancel') }}
        </r-button>
        <r-button variant="danger" @click="invoiceItemsToStock">
          {{ $t('OK') }}
        </r-button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import InvoiceToStockItem from '@/components/admin/invoices/InvoiceToStockItem.vue'
import RButton from '@/components/ui/RButton.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { getInvoice, updateStockedIn } from '@/services/InvoiceService'
import { getLocationOptions } from '@/services/LocationService'
import { getRoomOptions } from '@/services/RoomService'
import { stockIn } from '@/services/StockService'

export default defineComponent({
  components: { RButton, RSpinner, InvoiceToStockItem },
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
      invoice_code: undefined,
      invoice_date: undefined,
      roomOptions: [],
      locationOptions: [],
      invoiceItems: [],
      stockItems: []
    }
  },
  computed: {
    invoiceId() {
      return this.row.id
    }
  },
  watch: {
    showModal() {
      if (this.showModal) {
        this.fetchInvoiceItems()
      }
    }
  },
  methods: {
    async fetchInvoiceItems() {
      this.loading = true

      try {
        const product = await getInvoice(this.invoiceId)
        const rooms = await getRoomOptions()
        const locations = await getLocationOptions()
        const data = product.data.data.attributes
        const items = product.data.included

        for (let [key, value] of Object.entries(data)) {
          this[key] = value
        }

        this.invoiceItems = items.map((item) => {
          const productId = parseInt(item.relationships['product'].data.id)
          const productName = item.attributes.product_name
          const quantity = item.attributes.quantity

          return {
            id: parseInt(item.id),
            product_id: productId,
            product_name: productName,
            quantity: quantity
          }
        })

        this.stockItems = items.map((item) => {
          const productId = parseInt(item.relationships['product'].data.id)
          const quantity = item.attributes.quantity

          return {
            id: parseInt(item.id),
            product_id: productId,
            room_id: undefined,
            location_id: undefined,
            expiration: undefined,
            quantity: quantity
          }
        })

        this.roomOptions = rooms.data
        this.locationOptions = locations.data
      } catch (error) {}

      this.loading = false
    },
    handleStockItemChange(item) {
      this.stockItems = this.stockItems.map((stockItem) => {
        if (stockItem.id === item.id) {
          return { ...stockItem, ...item }
        } else {
          return stockItem
        }
      })
    },
    async invoiceItemsToStock() {
      if (!this.validate()) {
        return
      }

      Promise.all(
        this.stockItems.map((stockItem) =>
          stockIn({
            productId: stockItem.product_id,
            roomId: stockItem.room_id,
            locationId: stockItem.location_id,
            expiration: stockItem.expiration,
            quantity: stockItem.quantity
          })
        )
      )
        .then(() => {
          this.eventBus.emit('alert', { level: 'success', message: this.$t('Items were successfully stocked in') })
          updateStockedIn(this.invoiceId)
          this.row.attributes.stocked_in = true
        })
        .catch((error) => {
          this.eventBus.emit('alert', { level: 'alert', message: error })
        })
        .finally(() => {
          this.showModal = false
        })
    },
    validate() {
      let valid = true

      this.stockItems.forEach((stockItem) => {
        if (!stockItem.room_id) {
          this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select room') })
          valid = false

          return false
        }
        if (!stockItem.location_id) {
          this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select location') })
          valid = false

          return false
        }
      })

      return valid
    }
  }
})
</script>

<style lang="postcss" scoped>
:deep(.modal-container) {
  @apply flex justify-center items-center overflow-hidden z-50;
}
.modal__close {
  @apply absolute top-2 right-2;
}
</style>
