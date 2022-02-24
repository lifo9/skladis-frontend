<template>
  <div>
    <barcode-scanner />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'
export default defineComponent({
  components: { BarcodeScanner }
})
</script>
