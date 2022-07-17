<template>
  <div class="relative grid items-start space-y-4 md:grid-cols-2">
    <div class="col-span-2">
      <multiselect
        v-model="product"
        track-by="id"
        label="label"
        :options="products"
        :searchable="true"
        :loading="loading"
        :placeholder="$t('Product')"
        :select-label="$t('select')"
        :selected-label="$t('deselect')"
        :deselect-label="$t('deselect')"
        :no-options="$t('Not found')"
        :show-no-results="false"
      />
    </div>
    <div class="col-span-2 md:col-span-1">
      <multiselect
        v-model="room"
        track-by="id"
        label="label"
        :options="rooms"
        :searchable="true"
        :loading="loading"
        :placeholder="$t('Room')"
        :select-label="$t('select')"
        :selected-label="$t('deselect')"
        :deselect-label="$t('deselect')"
        :no-options="$t('Not found')"
        :show-no-results="false"
        @update:modelValue="$emit('roomChange', stockItem)"
        @remove="$emit('roomChange', stockItem)"
      />
    </div>
    <div class="col-span-2 md:col-span-1 md:ml-4">
      <multiselect
        v-model="location"
        track-by="id"
        label="label"
        :options="locations"
        :searchable="true"
        :loading="loading"
        :placeholder="$t('location')"
        :select-label="$t('select')"
        :selected-label="$t('deselect')"
        :deselect-label="$t('deselect')"
        :no-options="$t('Not found')"
        :show-no-results="false"
        @update:modelValue="$emit('locationChange', stockItem)"
        @remove="$emit('locationChange', stockItem)"
      />
    </div>
    <r-input
      v-model="expiration"
      class="col-span-1"
      custom-padding="p-2"
      type="date"
      :placeholder="$t('expiration')"
      :date-config="{ minDate: new Date() }"
    />
    <r-input
      v-model="quantity"
      class="col-span-1 ml-2"
      custom-padding="p-2"
      :placeholder="$t('quantity')"
      type="number"
      step="1"
      min="1"
      :required="true"
    />
    <barcode-scanner variant="full" class="col-span-2 md:col-span-1" @input="searchProduct" />
    <r-button size="full" variant="success" class="col-span-2 md:col-span-1 md:ml-4" @click="handleStockIn">
      <span class="material-icons">add</span>
      <span>{{ $filters.uppercase($t('Stocks in')) }}</span>
    </r-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Multiselect from 'vue-multiselect'

import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'
import RButton from '@/components/ui/RButton.vue'
import RInput from '@/components/ui/RInput.vue'
import { getProducts } from '@/services/ProductService'
import { stockIn } from '@/services/StockService'

export default defineComponent({
  components: { Multiselect, RInput, BarcodeScanner, RButton },
  props: {
    products: {
      type: Array,
      required: true
    },
    rooms: {
      type: Array,
      required: true
    },
    locations: {
      type: Array,
      required: true
    },
    initialItem: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      loading: false,
      product: undefined,
      room: undefined,
      location: undefined,
      expiration: undefined,
      quantity: undefined
    }
  },
  computed: {
    stockItem() {
      return {
        productId: this.product?.id,
        roomId: this.room?.id,
        locationId: this.location?.id,
        expiration: this.expiration,
        quantity: parseInt(this.quantity)
      }
    }
  },
  mounted() {
    if (this.initialItem) {
      this.product = this.products.filter((product) => product.id == this.initialItem.productId).pop()
      this.room = this.rooms.filter((room) => room.id == this.initialItem.roomId).pop()
      this.location = this.locations.filter((location) => location.id == this.initialItem.locationId).pop()
      this.quantity = this.initialItem.quantity
    }
  },
  methods: {
    async searchProduct(barcode) {
      if (barcode) {
        const code = barcode.code
        const product = await getProducts({ filters: { 'barcode_barcode_code': code } })
        if (product.data && product.data.data && product.data.data.length === 1) {
          const productOptions = this.products.filter(
            (option) => option.id.toString() === product.data.data[0].id.toString()
          )

          if (productOptions.length === 1) {
            let option = productOptions.pop()
            this.product = option
          }
        }
      }
    },
    async handleStockIn() {
      if (!this.validate()) {
        return
      }

      try {
        await stockIn({
          productId: this.product.id,
          roomId: this.room.id,
          locationId: this.location.id,
          expiration: this.expiration,
          quantity: parseInt(this.quantity)
        })

        this.eventBus.emit('alert', {
          level: 'success',
          message: this.$t('Stock was successfully added')
        })
      } catch (error) {}
    },
    validate() {
      if (!this.product) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select product') })
        return false
      }
      if (!this.room) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select room') })
        return false
      }
      if (!this.location) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select location') })
        return false
      }
      if (!this.quantity) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select quantity') })
        return false
      }

      return true
    }
  }
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
