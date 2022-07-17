<template>
  <div>
    <navigation-back class="my-8" />
    <crud-table
      v-if="!loading"
      :get-endpoint="getEndpoint"
      :enable-default-actions="false"
      :enable-global-actions="false"
      :hide-all-cols="true"
      :custom-cols-before="customCols"
      :bulk-select="false"
      :search-enabled="false"
      :filter-options="filterOptions"
      :initial-order="initialOrder"
      :initial-order-by="initialOrderBy"
      :per-page="50"
    />
    <r-spinner v-else class="mr-3 ml-1 h-4 w-4 text-white" />
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent, shallowRef } from 'vue'

import AvatarImage from '@/components/AvatarImage.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import NavigationBack from '@/components/ui/NavigationBack.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { getLocationOptions } from '@/services/LocationService'
import { getProductOptions } from '@/services/ProductService'
import { getRoomOptions } from '@/services/RoomService'
import { getCreatedAtRange, getStockTransactions } from '@/services/StockTransactionService'
import { getUserOptions } from '@/services/UsersService'
import { getWarehouseOptions } from '@/services/WarehouseService'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { CrudTable, RSpinner, NavigationBack },
  data() {
    return {
      loading: true,
      getEndpoint: getStockTransactions,
      customCols: [
        {
          header: '',
          component: shallowRef(AvatarImage),
          options: {
            relationship: 'user',
            attribute: 'avatar',
            rounded: true
          }
        },
        {
          header: this.$t('User'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'user',
            attribute: ['first_name', 'last_name'],
            editLink: true,
            editRouteName: 'UserEdit',
            sort: false
          }
        },
        {
          header: this.$t('created_at'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'created_at',
            sort: true,
            orderBy: 'created_at',
            format: this.$filters.formatDateTime
          }
        },
        {
          header: this.$t('event'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'action',
            sort: true,
            orderBy: 'action',
            translate: true,
            bold: true
          }
        },
        {
          header: this.$t('Product'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'stock',
            meta: 'product',
            attribute: 'name',
            editLink: true,
            editRouteName: 'ProductEdit',
            sort: false
          }
        },
        {
          header: this.$t('Room'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'stock',
            meta: 'room',
            attribute: 'name',
            editLink: true,
            editRouteName: 'RoomEdit',
            sort: false
          }
        },
        {
          header: this.$t('location'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'stock',
            meta: 'location',
            attribute: 'name',
            editLink: true,
            editRouteName: 'LocationEdit',
            sort: false
          }
        },
        {
          header: this.$t('quantity'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'pieces',
            sort: true,
            orderBy: 'pieces',
            bold: true
          }
        }
      ],
      filterOptions: undefined,
      initialOrder: 'desc',
      initialOrderBy: 'created_at'
    }
  },
  computed: {
    ...mapStores(useMainStore)
  },
  mounted() {
    this.setTitle()
    this.fetchData()
  },
  updated() {
    this.setTitle()
  },
  methods: {
    async fetchData() {
      this.loading = true

      const events = ['stock_in', 'stock_out'].map((event) => {
        return { id: event, label: this.$t(event) }
      })
      const createdAtRange = await getCreatedAtRange()

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

      const locations = await getLocationOptions()
      const locationOptions = locations.data.map((location) => {
        return { id: location.id, label: location.label }
      })

      const users = await getUserOptions()
      const userOptions = users.data.map((user) => {
        return { id: user.id, label: user.label }
      })

      this.filterOptions = {
        'stocktransaction_action[]': {
          label: this.$t('event'),
          options: events
        },
        'user_id[]': {
          label: this.$t('User'),
          options: userOptions
        },
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
        'stocktransaction_created_at': {
          label: this.$filters.capitalize(this.$t('created_at')),
          options: createdAtRange.data,
          type: 'date-range'
        }
      }

      this.loading = false
    },
    setTitle() {
      this.mainStore.setCurrentTitle(this.$t('Delivery of goods'))
      this.mainStore.setCurrentSubtitle(this.$t('Stocks transactions'))
    }
  }
})
</script>
