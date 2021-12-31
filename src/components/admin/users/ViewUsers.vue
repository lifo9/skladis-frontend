<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="UserCreate"
    edit-route-name="UserEdit"
    :bulk-select="true"
    :custom-actions="customActions"
  >
  </crud-table>
</template>

<script>
import CrudTable from '../../CrudTable.vue'
import { deleteUser, getUsers } from '../../../backend/services/UsersService'
import UserActivationToggle from '../../UserActivationToggle.vue'

export default {
  components: { CrudTable },
  data () {
    return {
      getEndpoint: getUsers,
      deleteEndpoint: deleteUser,
      customActions: [UserActivationToggle]
    }
  }
}
</script>
