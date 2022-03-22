<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="WarehouseCreate"
    edit-route-name="WarehouseEdit"
    :bulk-select="true"
    :hidden-cols="['coordinates', 'address_id']"
    :relationship-cols="relationshipCols"
    :custom-actions="customActions"
  />
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'

import CrudTable from '@/components/CrudTable.vue'
import CrudViewButton from '@/components/CrudViewButton.vue'
import { deleteWarehouse, getWarehouses } from '@/services/WarehouseService'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getWarehouses,
      deleteEndpoint: deleteWarehouse,
      customActions: [
        {
          component: markRaw(CrudViewButton),
          options: {
            route: 'StockView',
            label: this.$filters.uppercase(this.$t('stocks')),
            customClass: 'bg-green-600 hover:bg-green-500 focus:border-green-700 active:bg-green-400',
            query: 'warehouse_id[]'
          }
        }
      ],
      relationshipCols: [
        {
          relationship: 'address',
          relationship_type: 'address',
          table_name: 'addresses',
          attributes: [
            { id: 'street_name', label: this.$t('street_name') },
            { id: 'street_number', label: this.$t('street_number') },
            { id: 'city', label: this.$t('city') },
            { id: 'zip', label: this.$t('zip') },
            { id: 'country', label: this.$t('country') }
          ]
        }
      ]
    }
  }
})
</script>
