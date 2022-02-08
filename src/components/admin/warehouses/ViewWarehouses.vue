<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="WarehouseCreate"
    edit-route-name="WarehouseEdit"
    :bulk-select="true"
    :hiddenCols="['coordinates']"
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
      deleteEndpoint: deleteWarehouse
    }
  }
}
</script>
