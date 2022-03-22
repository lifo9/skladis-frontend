<template>
  <div class="grid relative items-start space-y-2 md:grid-cols-7 md:space-y-0 md:space-x-2">
    <div class="col-span-2 invoice-item__item" :data-title="$filters.capitalize($t('Product'))">
      <navigation-item
        v-if="product && added"
        :label="product.label"
        route-name="ProductEdit"
        :params="{ id: product.id }"
        type="plain"
        class="text-blue-600 cursor-pointer"
      />
      <multiselect
        v-else
        v-model="product"
        track-by="id"
        label="label"
        :options="products"
        :searchable="true"
        :loading="isLoading"
        :disabled="added"
        :internal-search="false"
        :placeholder="$t('Product')"
        :select-label="$t('select')"
        :selected-label="$t('deselect')"
        :deselect-label="$t('deselect')"
        :no-options="$t('Not found')"
        :show-no-results="false"
        @search-change="findProducts"
        @select="findSuppliers"
        @remove="findSuppliers({})"
      />
    </div>
    <div class="col-span-2 invoice-item__item" :data-title="$filters.capitalize($t('Supplier'))">
      <navigation-item
        v-if="supplier && added"
        :label="supplier.label"
        route-name="SupplierEdit"
        :params="{ id: supplier.id }"
        type="plain"
        class="text-blue-600 cursor-pointer"
      />
      <multiselect
        v-else
        v-model="supplier"
        track-by="id"
        label="label"
        :options="suppliers"
        :searchable="true"
        :loading="isLoading"
        :disabled="added"
        :internal-search="false"
        :placeholder="$t('Supplier')"
        :select-label="$t('select')"
        :selected-label="$t('deselect')"
        :deselect-label="$t('deselect')"
        :no-options="$t('Not found')"
        :show-no-results="false"
        @search-change="findSuppliers"
        @select="findProducts"
        @remove="findProducts({})"
      />
    </div>
    <div
      class="col-span-2 md:col-span-1 md:text-center invoice-item__item"
      :data-title="$filters.capitalize($t('quantity'))"
    >
      <span v-if="quantity && added">{{ quantity }}</span>
      <r-input
        v-else
        v-model="quantity"
        :disabled="isLoading || added"
        :placeholder="$t('quantity')"
        custom-padding="p-2"
        type="number"
        step="1"
        min="1"
      />
    </div>
    <div
      class="col-span-2 md:col-span-1 md:text-center invoice-item__item"
      :data-title="$filters.capitalize($t('unit_price'))"
    >
      <span v-if="unitPrice && added">{{ $filters.formatCurrency(unitPrice) }}</span>
      <r-input
        v-else
        v-model="unitPrice"
        :disabled="isLoading || added"
        :placeholder="$t('unit_price')"
        custom-padding="p-2"
        type="number"
        step="0.01"
        min="0"
      />
    </div>
    <div class="flex flex-wrap items-start space-x-2 h-full md:items-center">
      <r-button v-if="added" size="verySmall" variant="danger" @click="removeItem">
        <span class="material-icons">delete</span>
      </r-button>
      <barcode-scanner v-if="!added" variant="compact" @input="searchProduct" />
      <r-button v-if="!added" size="verySmall" @click="addItem">
        <span class="material-icons">add</span>
      </r-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Multiselect from 'vue-multiselect'

import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'
import NavigationItem from '@/components/NavigationItem.vue'
import RButton from '@/components/ui/RButton.vue'
import RInput from '@/components/ui/RInput.vue'
import { getProductOptions, getProducts } from '@/services/ProductService'
import { getSupplierOptions } from '@/services/SupplierService'

export default defineComponent({
  components: { Multiselect, RInput, RButton, BarcodeScanner, NavigationItem },
  props: {
    initialProduct: {
      type: Number,
      default: undefined
    },
    initialSupplier: {
      type: Number,
      default: undefined
    },
    initialQuantity: {
      type: Number,
      default: undefined
    },
    initialUnitPrice: {
      type: String,
      default: undefined
    },
    productOptions: {
      type: Array,
      default: undefined
    },
    supplierOptions: {
      type: Array,
      default: undefined
    },
    added: {
      type: Boolean,
      default: false
    }
  },
  emits: ['removeInvoiceItem', 'addInvoiceItem'],
  data() {
    return {
      product: undefined,
      supplier: undefined,
      quantity: undefined,
      unitPrice: undefined,
      products: [],
      suppliers: [],
      isLoading: false
    }
  },
  computed: {
    item() {
      return {
        product_id: this.product?.id,
        supplier_id: this.supplier?.id,
        quantity: this.quantity,
        unit_price: this.unitPrice
      }
    }
  },
  async mounted() {
    if (!this.productOptions || (this.initialSupplier && !this.initialProduct)) {
      let query
      if (this.initialSupplier) {
        query = { id: this.initialSupplier }
      }
      await this.findProducts(query)
    } else {
      this.products = this.productOptions
    }
    if (!this.supplierOptions) {
      let query
      if (this.initialProduct) {
        query = { id: this.initialProduct }
      }
      await this.findSuppliers(query)
    } else {
      this.suppliers = this.supplierOptions
    }
    if (this.initialProduct) {
      this.product = this.products.filter((product) => product.id === this.initialProduct)?.pop()
    }
    if (this.initialSupplier) {
      this.supplier = this.suppliers.filter((supplier) => supplier.id === this.initialSupplier)?.pop()
    }
    if (this.initialQuantity) {
      this.quantity = this.initialQuantity
    }
    if (this.initialUnitPrice) {
      this.unitPrice = this.initialUnitPrice
    }
  },
  methods: {
    async findProducts(search = undefined) {
      let query

      if (typeof search === 'string') {
        query = { search: search }
      }
      if (typeof search === 'object') {
        if (search.id) {
          query = { ...query, 'suppliers_id[]': search.id }
        }
      } else if (this.supplier) {
        query = { ...query, 'suppliers_id[]': this.supplier.id }
      }

      await this.findAsync('products', getProductOptions, query)
    },
    async findSuppliers(search = undefined) {
      let query

      if (typeof search === 'string') {
        query = { search: search }
      }
      if (typeof search === 'object') {
        if (search.id) {
          query = { ...query, 'products_id[]': search.id }
        }
      } else if (this.product) {
        query = { ...query, 'products_id[]': this.product.id }
      }

      await this.findAsync('suppliers', getSupplierOptions, query)
    },
    async findAsync(dataKey, findMethod, query = undefined) {
      this.isLoading = true

      try {
        let data
        if (query) {
          data = await findMethod(query)
        } else {
          data = await findMethod()
        }
        if (data.data) {
          this[dataKey] = data.data
        }
      } catch (error) {
        // pass
      }

      this.isLoading = false
    },
    validate() {
      if (!this.product) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select product') })
        return false
      }
      if (!this.supplier) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select supplier') })
        return false
      }
      if (!this.quantity) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select quantity') })
        return false
      }
      if (!this.unitPrice) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select unit price') })
        return false
      }

      return true
    },
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
            this.findSuppliers({ id: option.id })
          }
        }
      }
    },
    async addItem() {
      if (!this.validate()) {
        return
      }
      this.$emit('addInvoiceItem', this.item)

      this.product = undefined
      this.supplier = undefined
      this.quantity = 1
      this.unitPrice = undefined

      if (this.added) {
        await this.findSuppliers()
        await this.findProducts()
      }
    },
    removeItem() {
      if (!this.validate()) {
        return
      }

      this.$emit('removeInvoiceItem')
    }
  }
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style lang="postcss" scoped>
@screen md {
  :deep(.multiselect.multiselect--active) {
    position: initial !important;
    @apply border-blue-600 border rounded-md;
  }
  :deep(.multiselect.multiselect--active .multiselect__tags) {
    @apply rounded-md;
  }
  :deep(.multiselect__select),
  .multiselect__tags .multiselect__spinner {
    @apply hidden;
  }

  :deep(.multiselect__content-wrapper) {
    @apply left-0 my-2 rounded-md border-l-gray-300 border-r-gray-300 border-t-gray-300 border-b-gray-300 border-t border-b border-l border-r border-solid z-50;
  }
}

:deep(.multiselect--disabled.multiselect) {
  opacity: 1 !important;
}
:deep(.multiselect--disabled.multiselect .multiselect__single) {
  @apply text-base;
  color: rgb(17 24 39) !important;
}

@media (max-width: 768px) {
  .invoice-item__item {
    @apply relative pt-7;
  }
  .invoice-item__item:before {
    @apply px-2 py-1 text-xs font-medium tracking-wider text-left uppercase absolute top-0 left-0 text-white bg-gray-800;
    content: attr(data-title);
  }
}
</style>
