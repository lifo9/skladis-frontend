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
    :custom-actions="customActions"
    :custom-global-actions="customGlobalActions"
  />
  <r-spinner v-else class="mr-3 ml-1 h-4 w-4 text-white" />
</template>

<script lang="ts">
import { defineComponent, markRaw, shallowRef } from 'vue'

import StockOutModal from '@/components/admin/stocks/StockOutModal.vue'
import StockOutScan from '@/components/admin/stocks/StockOutScan.vue'
import StockTransferModal from '@/components/admin/stocks/StockTransferModal.vue'
import AvatarImage from '@/components/AvatarImage.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import NavigationItem from '@/components/NavigationItem.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { getLocationOptions } from '@/services/LocationService'
import { getProductOptions } from '@/services/ProductService'
import { getRoomOptions } from '@/services/RoomService'
import { getExpirationRange, getStocks } from '@/services/StockService'
import { getWarehouseOptions } from '@/services/WarehouseService'

export default defineComponent({
  components: { CrudTable, RSpinner },
  data() {
    return {
      loading: true,
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
          component: markRaw(StockOutScan)
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
      customActions: [
        { component: markRaw(StockOutModal) },
        {
          component: markRaw(StockTransferModal),
          options: { roomOptions: [], locationOptions: [] }
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
          header: this.$t('location'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'location',
            attribute: ['name'],
            editLink: true,
            editRouteName: 'LocationEdit',
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
  async mounted() {
    await this.fetchData()
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
        return { id: room.id, label: room.label, location_ids: room.location_ids }
      })

      const locations = await getLocationOptions()
      const locationOptions = locations.data.map((location) => {
        return { id: location.id, label: location.label, room_id: location.room_id }
      })

      this.customActions[1].options = { roomOptions: roomOptions, locationOptions: locationOptions }

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
        'location_id[]': {
          label: this.$t('location'),
          options: locationOptions
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
