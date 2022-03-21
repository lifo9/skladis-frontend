<template>
  <crud-table
    v-if="!loading"
    :get-endpoint="getEndpoint"
    :enable-default-actions="false"
    :enable-global-actions="false"
    :hide-all-cols="true"
    :custom-cols-before="customCols"
    :bulk-select="false"
    :filter-options="filterOptions"
    :initial-order="initialOrder"
    :initial-order-by="initialOrderBy"
  />
  <r-spinner v-else class="mr-3 ml-1 w-4 h-4 text-white" />
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'

import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { getProductOptions } from '@/services/ProductService'
import { getRoomOptions } from '@/services/RoomService'
import { getExpirationRange, getStocks } from '@/services/StockService'

export default defineComponent({
  components: { CrudTable, RSpinner },
  data() {
    return {
      loading: false,
      getEndpoint: getStocks,
      initialOrderBy: 'expiration',
      initialOrder: 'asc',
      filterOptions: undefined,
      customCols: [
        {
          header: this.$t('Product'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'product',
            attribute: ['name'],
            editLink: true,
            editRouteName: 'ProductEdit',
            sort: false
          }
        },
        {
          header: this.$t('Room'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'room',
            attribute: ['name'],
            editLink: true,
            editRouteName: 'RoomEdit',
            sort: false
          }
        },
        {
          header: this.$t('expiration'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'expiration',
            sort: true,
            orderBy: 'expiration',
            format: this.$filters.formatDate
          }
        },
        {
          header: this.$t('quantity'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'pieces',
            sort: true,
            orderBy: 'pieces'
          }
        }
      ]
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true

      const products = await getProductOptions()
      const productOptions = products.data.map((product) => {
        return { id: product.id, label: product.label }
      })

      const rooms = await getRoomOptions()
      const roomOptions = rooms.data.map((room) => {
        return { id: room.id, label: room.label }
      })

      const expirationRange = await getExpirationRange()

      this.filterOptions = {
        'product_id[]': {
          label: this.$t('Product'),
          options: productOptions
        },
        'room_id[]': {
          label: this.$t('Room'),
          options: roomOptions
        },
        'stock_expiration': {
          label: this.$filters.capitalize(this.$t('expiration')),
          options: expirationRange.data,
          type: 'date-range'
        }
      }

      this.loading = false
    }
  }
})
</script>
