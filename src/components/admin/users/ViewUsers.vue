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
  >
  </crud-table>
</template>

<script>
import CrudTable from '../../CrudTable.vue'
import { deleteUser, getUsers } from '../../../backend/services/UsersService'
import UserActivationToggle from './UserActivationToggle.vue'
import AvatarImage from '../../AvatarImage.vue'

export default {
  components: { CrudTable },
  data () {
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
          attributes: [{ id: 'name', label: this.$t('roles') }]
        }
      ]
    }
  }
}
</script>
