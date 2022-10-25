<template>
  <crud-table
    v-if="!loading"
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="InvoiceCreate"
    edit-route-name="InvoiceEdit"
    :bulk-select="true"
    :hide-all-cols="true"
    :custom-cols-before="customCols"
    :custom-actions="customActions"
    :filter-options="filterOptions"
    initial-order="desc"
    initial-order-by="created_at"
  />
  <r-spinner v-else class="mr-3 ml-1 h-4 w-4 text-white" />
</template>

<script lang="ts">
import { defineComponent, markRaw, shallowRef } from 'vue'

import InvoiceToStock from '@/components/admin/invoices/InvoiceToStock.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { deleteInvoice, getInvoices, getInvoicesDateRange } from '@/services/InvoiceService'

export default defineComponent({
  components: { CrudTable, RSpinner },
  data() {
    return {
      loading: true,
      getEndpoint: getInvoices,
      deleteEndpoint: deleteInvoice,
      filterOptions: undefined,
      customActions: [{ component: markRaw(InvoiceToStock) }],
      customCols: [
        {
          header: this.$t('invoice_code'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'invoice_code',
            sort: true,
            orderBy: 'invoice_code'
          }
        },
        {
          header: this.$t('created_at'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'invoice_date',
            sort: true,
            orderBy: 'invoice_date',
            format: this.$filters.formatDate
          }
        },
        {
          header: this.$t('invoice'),
          component: shallowRef(CrudLink),
          options: {
            attribute: 'invoice_code',
            linkAttribute: 'invoice_file',
            newTab: true,
            sort: false
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

      const invoicesRange = await getInvoicesDateRange()

      this.filterOptions = {
        'invoice_invoice_date': {
          label: this.$filters.capitalize(this.$t('created_at')),
          options: invoicesRange.data,
          type: 'date-range'
        }
      }

      this.loading = false
    }
  }
})
</script>
