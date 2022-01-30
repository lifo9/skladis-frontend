<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="ContactsCreate"
    edit-route-name="ContactsEdit"
    :bulk-select="true"
    :custom-cols-before="customCols"
    :hiddenCols="['avatar']"
  />
</template>

<script>
import CrudTable from '../../../components/CrudTable.vue'
import {
  getContacts,
  deleteContact
} from '../../../backend/services/ContactsService'
import UserAvatarImageVue from '../../UserAvatarImage.vue'

export default {
  components: { CrudTable },
  data () {
    return {
      getEndpoint: getContacts,
      deleteEndpoint: deleteContact,
      customCols: [
        {
          header: '',
          component: UserAvatarImageVue
        }
      ]
    }
  }
}
</script>
