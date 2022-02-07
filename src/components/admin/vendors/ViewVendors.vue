<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="VendorsCreate"
    edit-route-name="VendorsEdit"
    :bulk-select="true"
    :custom-cols-before="customCols"
    :hideAllCols="true"
  />
</template>

<script>
import CrudTable from '../../../components/CrudTable.vue'
import {
  getVendors,
  deleteVendor
} from '../../../backend/services/VendorService'
import AvatarImage from '../../AvatarImage.vue'
import CrudLink from '../../CrudLink.vue'
import CrudText from '../../CrudText.vue'

export default {
  components: { CrudTable },
  data () {
    return {
      getEndpoint: getVendors,
      deleteEndpoint: deleteVendor,
      customCols: [
        {
          header: '',
          component: AvatarImage,
          options: {
            attribute: 'logo'
          }
        },
        {
          header: this.$t('name'),
          component: CrudText,
          options: {
            attribute: 'name',
            sort: true
          }
        },
        {
          header: this.$t('url'),
          component: CrudLink,
          options: {
            attribute: 'url',
            newTab: true,
            sort: true
          }
        }
      ]
    }
  }
}
</script>
