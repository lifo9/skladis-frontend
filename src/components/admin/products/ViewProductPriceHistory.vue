<template>
  <div>
    <navigation-back custom-route="ProductsView" />
    <crud-table
      v-if="!loading"
      :get-endpoint="getEndpoint"
      :item-id="productId"
      :enable-default-actions="false"
      :enable-global-actions="false"
      :bulk-select="false"
      :search-enabled="false"
      :per-page="50"
      :initial-order="initialOrder"
      :initial-order-by="initialOrderBy"
      :hide-all-cols="true"
      :custom-cols-before="customCols"
    />
    <r-spinner v-else class="mr-3 ml-1 w-4 h-4 text-white" />
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent, shallowRef } from 'vue'

import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import NavigationBack from '@/components/ui/NavigationBack.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { getProduct, getProductPriceHistory } from '@/services/ProductService'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { NavigationBack, RSpinner, CrudTable },
  data() {
    return {
      loading: false,
      name: '',
      getEndpoint: getProductPriceHistory,
      initialOrder: 'desc',
      initialOrderBy: 'invoices.invoice_date',
      customCols: [
        {
          header: this.$t('invoice_date'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'invoice_date',
            sort: true,
            orderBy: 'invoices.invoice_date',
            format: this.$filters.formatDateTime
          }
        },
        {
          header: this.$t('invoice'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'invoice',
            attribute: 'invoice_code',
            editLink: true,
            editRouteName: 'InvoiceEdit'
          }
        },
        {
          header: this.$t('Supplier'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'supplier',
            attribute: 'name',
            editLink: true,
            editRouteName: 'SupplierEdit',
            sort: true,
            orderBy: 'suppliers.name'
          }
        },
        {
          header: this.$t('quantity'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'quantity',
            sort: true,
            orderBy: 'quantity'
          }
        },
        {
          header: this.$t('unit_price'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'unit_price',
            sort: true,
            orderBy: 'unit_price',
            format: this.$filters.formatCurrency
          }
        }
      ]
    }
  },
  computed: {
    productId() {
      return parseInt(this.$route.params.id)
    },
    ...mapStores(useMainStore)
  },
  async beforeMount() {
    await this.fetchData()
    this.mainStore.setCurrentTitle(this.$t('Products'))
    this.mainStore.setCurrentSubtitle(`${this.$t('Price history')} - ${this.name}`)
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const product = await getProduct(this.productId)
        this.name = product.data.data.attributes.name
      } catch (error) {}
      this.loading = false
    }
  }
})
</script>
