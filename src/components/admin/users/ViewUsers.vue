<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="UserCreate"
    edit-route-name="UserEdit"
    :bulk-select="true"
  />
</template>

<script>
import CrudTable from '../../CrudTable.vue'
import { deleteUser, getUsers } from '../../../backend/services/UsersService'

export default {
  components: { CrudTable },
  data () {
    return {
      getEndpoint: getUsers,
      deleteEndpoint: deleteUser
    }
  }
}
</script>
