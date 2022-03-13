<template>
  <div class="my-14 mx-auto w-full max-w-5xl divide-y-[1px] divide-gray-300 md:divide-y-0">
    <h2>{{ $t('Invoice items') }}</h2>
    <invoice-item
      v-for="(invoiceItem, idx) in invoiceItems"
      :key="JSON.stringify(invoiceItem)"
      class="py-2"
      :initial-product="invoiceItem.product_id"
      :initial-supplier="invoiceItem.supplier_id"
      :initial-quantity="parseInt(invoiceItem.quantity)"
      :initial-unit-price="invoiceItem.unit_price"
      :added="true"
      @remove-invoice-item="handleRemoveInvoiceItem(idx)"
    />
    <div class="hidden my-4 w-full h-[1px] bg-gray-300 md:block"></div>
    <invoice-item class="py-2 md:p-0" @add-invoice-item="handleAddInvoiceItem" />
  </div>
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
  },
  methods: {
    handleAddInvoiceItem(item) {
      this.invoiceItems.push(item)
    },
    handleRemoveInvoiceItem(idx) {
      this.invoiceItems.splice(idx, 1)
    }
  }
})
</script>
