<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="WarehouseCreate"
    edit-route-name="WarehouseEdit"
    :bulk-select="true"
    :hiddenCols="['coordinates', 'address_id']"
    :relationshipCols="relationshipCols"
  />
</template>

<script>
import CrudTable from '../../../components/CrudTable.vue'
import {
  getWarehouses,
  deleteWarehouse
} from '../../../backend/services/WarehouseService'

export default {
  components: { CrudTable },
  data () {
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
}
</script>
