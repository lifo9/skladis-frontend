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

<script lang="ts">
import CrudTable from '../../../components/CrudTable.vue'
import { getContacts, deleteContact } from '@/services/ContactsService'
import AvatarImage from '../../AvatarImage.vue'

import { defineComponent } from 'vue'
export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getContacts,
      deleteEndpoint: deleteContact,
      customCols: [
        {
          header: '',
          component: AvatarImage,
          options: {
            attribute: 'avatar'
          }
        }
      ]
    }
  }
})
</script>
