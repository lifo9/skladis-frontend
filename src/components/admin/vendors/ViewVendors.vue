<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="VendorsCreate"
    edit-route-name="VendorsEdit"
    :bulk-select="true"
    :custom-cols-before="customCols"
    :hide-all-cols="true"
  />
</template>

<script lang="ts">
import { shallowRef } from 'vue'
import { defineComponent } from 'vue'

import { deleteVendor, getVendors } from '@/services/VendorService'

import CrudTable from '../../../components/CrudTable.vue'
import AvatarImage from '../../AvatarImage.vue'
import CrudLink from '../../CrudLink.vue'
import CrudText from '../../CrudText.vue'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getVendors,
      deleteEndpoint: deleteVendor,
      customCols: [
        {
          header: '',
          component: shallowRef(AvatarImage),
          options: {
            attribute: 'logo'
          }
        },
        {
          header: this.$t('name'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'name',
            sort: true
          }
        },
        {
          header: this.$t('url'),
          component: shallowRef(CrudLink),
          options: {
            attribute: 'url',
            newTab: true,
            sort: true,
            orderBy: 'url'
          }
        }
      ]
    }
  }
})
</script>
