<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="ContactsCreate"
    edit-route-name="ContactEdit"
    :bulk-select="true"
    :custom-cols-before="customCols"
    :hidden-cols="['avatar']"
  />
</template>

<script lang="ts">
import { shallowRef } from 'vue'
import { defineComponent } from 'vue'

import AvatarImage from '@/components/AvatarImage.vue'
import CrudTable from '@/components/CrudTable.vue'
import { deleteContact, getContacts } from '@/services/ContactsService'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getContacts,
      deleteEndpoint: deleteContact,
      customCols: [
        {
          header: '',
          component: shallowRef(AvatarImage),
          options: {
            attribute: 'avatar',
            rounded: true
          }
        }
      ]
    }
  }
})
</script>
