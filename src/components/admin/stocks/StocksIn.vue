<template>
  <div>
    <navigation-back />
    <div v-if="!loading" class="my-14 mx-auto w-full max-w-5xl space-y-6">
      <stock-in-item :products="products" :rooms="rooms" :locations="locations" />
    </div>
    <r-spinner v-else class="mr-3 ml-1 h-4 w-4 text-white" />
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import StockInItem from '@/components/admin/stocks/StockInItem.vue'
import NavigationBack from '@/components/ui/NavigationBack.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { getLocationOptions } from '@/services/LocationService'
import { getProductOptions } from '@/services/ProductService'
import { getRoomOptions } from '@/services/RoomService'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { NavigationBack, StockInItem, RSpinner },
  data() {
    return {
      loading: false,
      products: [],
      rooms: [],
      locations: []
    }
  },
  computed: {
    ...mapStores(useMainStore)
  },
  async mounted() {
    this.setTitle()
    await this.findProducts()
    await this.findRooms()
    await this.findLocations()
  },
  updated() {
    this.setTitle()
  },
  methods: {
    async findProducts() {
      await this.findAsync('products', getProductOptions)
    },
    async findRooms() {
      await this.findAsync('rooms', getRoomOptions)
    },
    async findLocations() {
      await this.findAsync('locations', getLocationOptions)
    },
    async findAsync(dataKey, findMethod) {
      this.loading = true

      try {
        const data = await findMethod()

        if (data.data) {
          this[dataKey] = data.data
        }
      } catch (error) {
        // pass
      }

      this.loading = false
    },
    setTitle() {
      this.mainStore.setCurrentTitle(this.$t('Delivery of goods'))
      this.mainStore.setCurrentSubtitle(this.$t('Stocks in'))
    }
  }
})
</script>
