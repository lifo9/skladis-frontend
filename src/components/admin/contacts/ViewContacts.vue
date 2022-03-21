<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="ContactsCreate"
    edit-route-name="ContactEdit"
    :bulk-select="true"
    :custom-cols-before="customCols"
    :hidden-cols="['avatar']"
    :custom-actions="customActions"
  />
</template>

<script lang="ts">
import { markRaw, shallowRef } from 'vue'
import { defineComponent } from 'vue'

import AvatarImage from '@/components/AvatarImage.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudViewButton from '@/components/CrudViewButton.vue'
import { deleteContact, getContacts } from '@/services/ContactsService'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getContacts,
      deleteEndpoint: deleteContact,
      customActions: [
        {
          component: markRaw(CrudViewButton),
          options: {
            route: 'SuppliersView',
            label: this.$filters.uppercase(this.$t('Suppliers')),
            customClass: 'bg-green-600 hover:bg-green-500 focus:border-green-700 active:bg-green-400',
            query: 'contact_id[]'
          }
        }
      ],
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
