<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="ProductCreate"
    edit-route-name="ProductEdit"
    :bulk-select="true"
    :custom-cols-before="customCols"
    :hide-all-cols="true"
  />
</template>

<script lang="ts">
import { shallowRef } from 'vue'
import { defineComponent } from 'vue'

import AvatarImage from '@/components/AvatarImage.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import { deleteProduct, getProducts } from '@/services/ProductService'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getProducts,
      deleteEndpoint: deleteProduct,
      customCols: [
        {
          header: '',
          component: shallowRef(AvatarImage),
          options: {
            attribute: 'images',
            subAttribute: 'url'
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
          header: this.$t('Suppliers'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'suppliers',
            attribute: 'name',
            editLink: true,
            editRouteName: 'SupplierEdit'
          }
        }
      ]
    }
  }
})
</script>
