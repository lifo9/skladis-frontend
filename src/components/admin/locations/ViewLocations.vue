<template>
  <navigation-back custom-route="RoomsView" />
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="LocationCreate"
    edit-route-name="LocationEdit"
    :bulk-select="true"
    :item-id="roomId"
    id-param-name="location_id"
    :custom-actions="customActions"
  ></crud-table>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent, markRaw } from 'vue'

import CrudTable from '@/components/CrudTable.vue'
import CrudViewButton from '@/components/CrudViewButton.vue'
import NavigationBack from '@/components/ui/NavigationBack.vue'
import { deleteLocation, getLocations } from '@/services/LocationService'
import { getRoom } from '@/services/RoomService'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { CrudTable, NavigationBack },
  data() {
    return {
      getEndpoint: getLocations,
      deleteEndpoint: deleteLocation,
      customActions: [
        {
          component: markRaw(CrudViewButton),
          options: {
            route: 'StockView',
            label: this.$filters.uppercase(this.$t('stocks')),
            customClass: 'bg-green-600 hover:bg-green-500 focus:border-green-700 active:bg-green-400',
            query: 'location_id[]'
          }
        }
      ],
      name: '',
      loading: false
    }
  },
  computed: {
    roomId() {
      return parseInt(this.$route.params.id)
    },
    ...mapStores(useMainStore)
  },
  async beforeMount() {
    await this.fetchData()
    this.mainStore.setCurrentTitle(this.$t('locations'))
    this.mainStore.setCurrentSubtitle(`${this.$t('Room')} - ${this.name}`)
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const product = await getRoom(this.roomId)
        this.name = product.data.data.attributes.name
      } catch (error) {}
      this.loading = false
    }
  }
})
</script>
