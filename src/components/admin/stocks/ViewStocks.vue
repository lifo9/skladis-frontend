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
    :custom-global-actions="customGlobalActions"
  />
  <r-spinner v-else class="mr-3 ml-1 w-4 h-4 text-white" />
</template>

<script lang="ts">
import { defineComponent, markRaw, shallowRef } from 'vue'

import AvatarImage from '@/components/AvatarImage.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import NavigationItem from '@/components/NavigationItem.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { getProductOptions } from '@/services/ProductService'
import { getRoomOptions } from '@/services/RoomService'
import { getExpirationRange, getStocks } from '@/services/StockService'
import { getWarehouseOptions } from '@/services/WarehouseService'

export default defineComponent({
  components: { CrudTable, RSpinner },
  data() {
    return {
      loading: false,
      getEndpoint: getStocks,
      initialOrderBy: 'expiration',
      initialOrder: 'asc',
      filterOptions: undefined,
      customGlobalActions: [
        {
          component: markRaw(NavigationItem),
          props: {
            routeName: 'StocksIn',
            label: this.$filters.uppercase(this.$t('Stocks in')),
            icon: 'add',
            type: 'button',
            size: 'small',
            class: 'mx-2 bg-green-600 hover:bg-green-500 focus:border-green-700 active:bg-green-400'
          }
        },
        {
          component: markRaw(NavigationItem),
          props: {
            routeName: 'StocksOut',
            label: this.$filters.uppercase(this.$t('Stocks out')),
            icon: 'remove',
            type: 'button',
            size: 'small',
            class: 'mx-2 bg-red-600 hover:bg-red-500 focus:border-red-700 active:bg-red-400'
          }
        },
        {
          component: markRaw(NavigationItem),
          props: {
            routeName: 'StocksTransfer',
            label: this.$filters.uppercase(this.$t('Stocks transfer')),
            icon: 'compare_arrows',
            type: 'button',
            size: 'small',
            class: 'mx-2 bg-yellow-600 hover:bg-yellow-500 focus:border-yellow-700 active:bg-yellow-400'
          }
        },
        {
          component: markRaw(NavigationItem),
          props: {
            routeName: 'StockTransactions',
            label: this.$filters.uppercase(this.$t('Stocks transactions')),
            icon: 'bug_report',
            type: 'button',
            size: 'small',
            class: 'mx-2'
          }
        }
      ],
      customCols: [
        {
          header: '',
          component: shallowRef(AvatarImage),
          options: {
            relationship: 'product',
            attribute: 'images',
            subAttribute: 'url'
          }
        },
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
          header: this.$t('in_stock'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'pieces',
            sort: true,
            orderBy: 'pieces',
            bold: true
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

      const warehouses = await getWarehouseOptions()
      const warehouseOptions = warehouses.data.map((warehouse) => {
        return { id: warehouse.id, label: warehouse.label }
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
        'warehouse_id[]': {
          label: this.$t('Warehouse'),
          options: warehouseOptions
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
