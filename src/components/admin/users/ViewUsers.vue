<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="UserCreate"
    edit-route-name="UserEdit"
    :bulk-select="true"
    :custom-cols-before="customCols"
    :custom-actions="customActions"
    :relationship-cols="relationshipCols"
    :hiddenCols="['avatar']"
  ></crud-table>
</template>

<script lang="ts">
import CrudTable from '../../CrudTable.vue'
import { deleteUser, getUsers } from '@/services/UsersService'
import UserActivationToggle from '@//components/admin/users/UserActivationToggle.vue'
import AvatarImage from '../../AvatarImage.vue'

import { defineComponent } from 'vue'
export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getUsers,
      deleteEndpoint: deleteUser,
      customActions: [UserActivationToggle],
      customCols: [
        {
          header: '',
          component: AvatarImage,
          options: {
            attribute: 'avatar'
          }
        }
      ],
      relationshipCols: [
        {
          relationship: 'roles',
          relationship_type: 'role',
          table_name: 'roles',
          attributes: [{ id: 'name', label: this.$t('roles') }]
        }
      ]
    }
  }
})
</script>
