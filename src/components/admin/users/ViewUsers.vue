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
    :hidden-cols="['avatar']"
  ></crud-table>
</template>

<script lang="ts">
import { markRaw, shallowRef } from 'vue'
import { defineComponent } from 'vue'

import UserActivationToggle from '@//components/admin/users/UserActivationToggle.vue'
import { deleteUser, getUsers } from '@/services/UsersService'

import AvatarImage from '../../AvatarImage.vue'
import CrudTable from '../../CrudTable.vue'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getUsers,
      deleteEndpoint: deleteUser,
      customActions: [markRaw(UserActivationToggle)],
      customCols: [
        {
          header: '',
          component: shallowRef(AvatarImage),
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
