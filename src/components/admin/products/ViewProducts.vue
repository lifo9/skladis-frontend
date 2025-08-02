<template>
  <crud-table
    v-if="!loading"
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="ProductCreate"
    edit-route-name="ProductEdit"
    :bulk-select="true"
    :custom-cols-before="customCols"
    :custom-actions="customActions"
    :hide-all-cols="true"
    :filter-options="filterOptions"
  >
    <template #customButtons>
      <r-button
        v-role="constants.roles.admin"
        class="m-2"
        variant="primary"
        size="small"
        :disabled="downloadingAudit"
        @click="downloadStockAudit"
      >
        <r-spinner v-if="downloadingAudit" class="mr-2 size-4" />
        <span v-else class="material-icons">download</span>
        &nbsp;{{ $filters.uppercase($t('Download Stock Audit')) }}
      </r-button>
    </template>
  </crud-table>
  <r-spinner v-else class="ml-1 mr-3 size-4 text-white" />
</template>

<script lang="ts">
import { markRaw, shallowRef } from 'vue'
import { defineComponent } from 'vue'

import AvatarImage from '@/components/AvatarImage.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import CrudViewButton from '@/components/CrudViewButton.vue'
import RButton from '@/components/ui/RButton.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { getStockAudit } from '@/services/AuditsService'
import { deleteProduct, getProducts } from '@/services/ProductService'
import { getSupplierOptions } from '@/services/SupplierService'

export default defineComponent({
  components: { CrudTable, RSpinner, RButton },
  inject: ['constants'],
  data() {
    return {
      getEndpoint: getProducts,
      deleteEndpoint: deleteProduct,
      downloadingAudit: false,
      customActions: [
        {
          component: markRaw(CrudViewButton),
          options: {
            route: 'ProductPriceHistory',
            label: this.$filters.uppercase(this.$t('Price history')),
            customClass: 'bg-green-600 hover:bg-green-500 focus:border-green-700 active:bg-green-400'
          }
        },
        {
          component: markRaw(CrudViewButton),
          options: {
            route: 'StockView',
            label: this.$filters.uppercase(this.$t('stocks')),
            customClass: 'bg-yellow-600 hover:bg-yellow-500 focus:border-yellow-700 active:bg-yellow-400',
            query: 'product_id[]'
          }
        },
        {
          component: markRaw(CrudViewButton),
          options: {
            route: 'StockTransactions',
            label: this.$filters.uppercase(this.$t('Stocks transactions')),
            customClass: 'bg-orange-600 hover:bg-orange-500 focus:border-orange-700 active:bg-orange-400',
            query: 'product_id[]'
          }
        }
      ],
      customCols: [
        {
          header: '',
          component: shallowRef(AvatarImage),
          options: {
            attribute: 'images',
            subAttribute: 'url'
          }
        },
        {
          header: this.$t('order_code'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'order_code',
            sort: true,
            orderBy: 'order_code'
          }
        },
        {
          header: this.$t('name'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'name',
            sort: true,
            orderBy: 'name'
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
          header: this.$t('Suppliers'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'suppliers',
            attribute: 'name',
            editLink: true,
            editRouteName: 'SupplierEdit'
          }
        }
      ],
      filterOptions: {},
      loading: true
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true

      const suppliers = await getSupplierOptions()
      const options = suppliers.data.map((supplier) => {
        return { id: supplier.id, label: supplier.label }
      })

      this.filterOptions = {
        'suppliers_id[]': {
          label: this.$t('Suppliers'),
          options: options
        }
      }
      this.loading = false
    },
    async downloadStockAudit() {
      this.downloadingAudit = true
      try {
        const response = await getStockAudit()

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url

        const contentDisposition = response.headers['content-disposition']
        let filename = `stock_audit_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }

        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        this.eventBus.emit('alert', {
          level: 'success',
          message: this.$t('Stock audit downloaded successfully')
        })
      } catch (error) {
        this.eventBus.emit('alert', {
          level: 'alert',
          message: this.$t('Failed to download stock audit')
        })
      } finally {
        this.downloadingAudit = false
      }
    }
  }
})
</script>
