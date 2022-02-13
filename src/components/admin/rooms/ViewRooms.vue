<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="RoomCreate"
    edit-route-name="RoomEdit"
    :bulk-select="true"
    :relationship-cols="relationshipCols"
  >
  </crud-table>
</template>

<script>
import CrudTable from '../../CrudTable.vue'
import { deleteRoom, getRooms } from '../../../backend/services/RoomService'

export default {
  components: { CrudTable },
  data () {
    return {
      getEndpoint: getRooms,
      deleteEndpoint: deleteRoom,
      relationshipCols: [
        {
          relationship: 'warehouse',
          relationship_type: 'warehouse',
          table_name: 'warehouses',
          attributes: [{ id: 'name', label: this.$t('warehouse') }]
        }
      ]
    }
  }
}
</script>
