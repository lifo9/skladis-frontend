<template>
  <div>
    <r-button variant="danger" size="verySmall" class="m-1" @click="showModal = true">
      <span class="material-icons">arrow_upward</span>
      {{ $filters.uppercase($t('Stocks out')) }}
    </r-button>
    <div>
      <vue-final-modal v-model="showModal" classes="modal-container">
        <div class="m-4 flex max-w-xl flex-wrap items-center justify-center rounded-md bg-white p-8">
          <div class="my-4 flex w-full flex-wrap justify-center">
            <h1 class="mb-10 w-full text-center">{{ $t('Delivery of goods') }}</h1>
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
            <r-input
              v-model="quantity"
              :placeholder="$t('quantity')"
              type="number"
              step="1"
              min="1"
              :required="true"
              :label="$filters.capitalize($t('quantity'))"
            />
          </div>
          <div class="flex w-full justify-between space-x-4 align-middle">
            <r-button variant="secondary" @click="showModal = false">
              {{ $t('Cancel') }}
            </r-button>
            <r-button variant="danger" @click="stockOut">
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

import CrudText from '@/components/CrudText.vue'
import RButton from '@/components/ui/RButton.vue'
import RInput from '@/components/ui/RInput.vue'
import { stockOut } from '@/services/StockService'

export default defineComponent({
  components: { RButton, RInput, CrudText },
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
      showModal: false,
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
    }
  },

  methods: {
    async stockOut() {
      if (!this.validate()) {
        return
      }

      try {
        await stockOut({
          productId: this.productId,
          roomId: this.roomId,
          locationId: this.locationId,
          expiration: this.expiration,
          quantity: parseInt(this.quantity)
        })

        this.eventBus.emit('alert', {
          level: 'success',
          message: this.$t('Stock out was successfull')
        })
        this.eventBus.emit('reloadCrudTable')
        this.showModal = false
      } catch (error) {
        console.log(error)
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

      return true
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
