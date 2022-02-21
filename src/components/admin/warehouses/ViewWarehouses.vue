<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="WarehouseCreate"
    edit-route-name="WarehouseEdit"
    :bulk-select="true"
    :hidden-cols="['coordinates', 'address_id']"
    :relationship-cols="relationshipCols"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { deleteWarehouse, getWarehouses } from '@/services/WarehouseService'

import CrudTable from '../../../components/CrudTable.vue'
export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getWarehouses,
      deleteEndpoint: deleteWarehouse,
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
