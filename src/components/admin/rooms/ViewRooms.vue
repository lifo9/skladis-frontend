<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="RoomCreate"
    edit-route-name="RoomEdit"
    :bulk-select="true"
    :relationship-cols="relationshipCols"
    :hidden-cols="['warehouse']"
    :custom-actions="customActions"
    :custom-cols-after="customCols"
  ></crud-table>
</template>

<script lang="ts">
import { markRaw, shallowRef } from 'vue'
import { defineComponent } from 'vue'

import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudViewButton from '@/components/CrudViewButton.vue'
import { deleteRoom, getRooms } from '@/services/RoomService'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getRooms,
      deleteEndpoint: deleteRoom,
      customActions: [
        {
          component: markRaw(CrudViewButton),
          options: {
            route: 'StockView',
            label: this.$filters.uppercase(this.$t('stocks')),
            customClass: 'bg-green-600 hover:bg-green-500 focus:border-green-700 active:bg-green-400',
            query: 'room_id[]'
          }
        }
      ],
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
