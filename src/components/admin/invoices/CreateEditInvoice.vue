<template>
  <div><invoice-item /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import InvoiceItem from '@/components/admin/invoices/InvoiceItem.vue'

export default defineComponent({
  components: { InvoiceItem },
  data() {
    return {
      invoiceItems: []
    }
  }
})
</script>
