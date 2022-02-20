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
  ></crud-table>
</template>

<script lang="ts">
import CrudTable from '../../CrudTable.vue'
import { deleteRoom, getRooms } from '@/services/RoomService'
import CrudLink from '../../CrudLink.vue'
import { shallowRef } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { CrudTable },
  data() {
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
          component: shallowRef(CrudLink),
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
})
</script>
