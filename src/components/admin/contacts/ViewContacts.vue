<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="ContactsCreate"
    :bulk-select="true"
  />
</template>

<script>
import CrudTable from '../../../components/CrudTable.vue'
import {
  getContacts,
  deleteContact
} from '../../../backend/services/ContactsService'

export default {
  components: { CrudTable },
  data () {
    return {
      getEndpoint: getContacts,
      deleteEndpoint: deleteContact
    }
  }
}
</script>
