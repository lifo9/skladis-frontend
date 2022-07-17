<template>
  <barcode-scanner
    variant="compact"
    class="mx-2 inline-flex max-w-sm items-center justify-center rounded-md border border-transparent bg-red-600 py-1 px-2 text-sm font-medium leading-6 transition duration-150 ease-in-out hover:bg-red-500 focus:border-red-700 active:bg-red-400"
    @input="searchProduct"
  ></barcode-scanner>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'
import { getProducts } from '@/services/ProductService'

export default defineComponent({
  components: { BarcodeScanner },
  emits: ['filter'],
  methods: {
    async searchProduct(barcode) {
      if (barcode) {
        const code = barcode.code
        const product = await getProducts({ filters: { 'barcode_barcode_code': code } })
        if (product.data && product.data.data && product.data.data.length === 1) {
          const productId = product.data.data[0].id
          if (productId) {
            const filter = { 'product_id[]': [parseInt(productId)] }
            let query = { ...this.$route.query, ...filter }

            this.$router.replace({ path: this.$route.path, query: query })
            this.eventBus.emit('filter', filter)
          }
        }
      }
    }
  }
})
</script>
