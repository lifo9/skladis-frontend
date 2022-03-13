<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :bulk-select="false"
    :enable-default-actions="false"
    :hide-all-cols="true"
    :custom-cols-before="customCols"
    :custom-global-actions="customGlobalActions"
    :custom-actions="customActions"
  />
</template>

<script lang="ts">
import { defineComponent, markRaw, shallowRef } from 'vue'

import CrudCreateButton from '@/components/CrudCreateButton.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import CrudViewButton from '@/components/CrudViewButton.vue'
import { getInvoices } from '@/services/InvoiceService'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getInvoices,
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
            customCaption: this.$t('invoice'),
            linkAttribute: 'invoice_file',
            newTab: true,
            sort: false
          }
        }
      ],
      customGlobalActions: [{ component: markRaw(CrudCreateButton), props: { routeName: 'InvoiceCreate' } }],
      customActions: [{ component: markRaw(CrudViewButton), options: { route: 'InvoiceView' } }]
    }
  }
})
</script>
