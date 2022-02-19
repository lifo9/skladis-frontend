<template>
  <div>
    <barcode-scanner />
  </div>
</template>

<script lang="ts">
import BarcodeScanner from '../../components/admin/BarcodeScanner.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: { BarcodeScanner }
})
</script>
