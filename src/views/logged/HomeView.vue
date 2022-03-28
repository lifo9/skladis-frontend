<template>
  <div class="grid justify-center items-start mx-auto max-w-screen-2xl xl:grid-cols-2 xl:space-x-4">
    <div class="col-span-2 md:col-span-1">
      <h1>{{ $t('Products with low quantity') }}</h1>
      <crud-table
        :get-endpoint="getEndpointProducts"
        :bulk-select="false"
        :hide-all-cols="true"
        :enable-default-actions="false"
        :custom-cols-before="customColsProducts"
        :show-id="false"
        :initial-order="initialOrderProducts"
        :initial-order-by="initialOrderByProducts"
        :search-enabled="false"
        :per-page="5"
      />
    </div>
    <div class="col-span-2 md:col-span-1">
      <h1>{{ $t('Products with ending expiration') }}</h1>
      <crud-table
        :get-endpoint="getEndpointStocks"
        :bulk-select="false"
        :hide-all-cols="true"
        :enable-default-actions="false"
        :custom-cols-before="customColsStocks"
        :show-id="false"
        :initial-order="initialOrderStocks"
        :initial-order-by="initialOrderByStocks"
        :search-enabled="false"
        :per-page="5"
      />
    </div>
    <div class="col-span-2">
      <h1>{{ $t('Stocks transactions') }}</h1>
      <crud-table
        :get-endpoint="getEndpointTransactions"
        :bulk-select="false"
        :hide-all-cols="true"
        :enable-default-actions="false"
        :custom-cols-before="customColsTransactions"
        :show-id="false"
        :initial-order="initialOrderTransactions"
        :initial-order-by="initialOrderByTransactions"
        :search-enabled="false"
        :per-page="5"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'

import AvatarImage from '@/components/AvatarImage.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import { getProducts } from '@/services/ProductService'
import { getStocks } from '@/services/StockService'
import { getStockTransactions } from '@/services/StockTransactionService'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpointProducts: getProducts,
      initialOrderProducts: 'asc',
      initialOrderByProducts: 'in_stock_critical',
      customColsProducts: [
        {
          header: '',
          component: shallowRef(AvatarImage),
          options: {
            attribute: 'images',
            subAttribute: 'url'
          }
        },
        {
          header: this.$t('name'),
          component: shallowRef(CrudLink),
          options: {
            attribute: 'name',
            editLinkIdColumn: 'id',
            editLink: true,
            editRouteName: 'ProductEdit',
            sort: false
          }
        },
        {
          header: this.$t('in_stock'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'in_stock',
            bold: true,
            sort: true,
            orderBy: 'in_stock'
          }
        },
        {
          header: this.$t('pieces_ideal'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'pieces_ideal',
            sort: true,
            orderBy: 'pieces_ideal'
          }
        },
        {
          header: this.$t('pieces_critical'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'pieces_critical',
            sort: true,
            orderBy: 'pieces_critical'
          }
        }
      ],
      initialOrderTransactions: 'desc',
      initialOrderByTransactions: 'created_at',
      getEndpointTransactions: getStockTransactions,
      customColsTransactions: [
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
      initialOrderStocks: 'asc',
      initialOrderByStocks: 'expiration',
      getEndpointStocks: getStocks,
      customColsStocks: [
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
  }
})
</script>
