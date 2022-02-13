<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="RoomCreate"
    edit-route-name="RoomEdit"
    :bulk-select="true"
    :relationship-cols="relationshipCols"
    :hiddenCols="['warehouse']"
    :custom-cols-after="customCols"
  >
  </crud-table>
</template>

<script>
import CrudTable from '../../CrudTable.vue'
import { deleteRoom, getRooms } from '../../../backend/services/RoomService'
import CrudLink from '../../CrudLink.vue'

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
      ],
      customCols: [
        {
          header: this.$t('warehouse'),
          component: CrudLink,
          options: {
            relationship: 'warehouse',
            attribute: 'name',
            editLink: true,
            editRouteName: 'WarehouseEdit',
            sort: true,
            orderBy: 'warehouses.name'
          }
        }
      ]
    }
  }
}
</script>
