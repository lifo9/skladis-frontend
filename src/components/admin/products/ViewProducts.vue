<template>
  <crud-table
    v-if="!loading"
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="ProductCreate"
    edit-route-name="ProductEdit"
    :bulk-select="true"
    :custom-cols-before="customCols"
    :hide-all-cols="true"
    :filter-options="filterOptions"
    :filter-placeholder="$t('Suppliers')"
  />
  <r-spinner v-else class="mr-3 ml-1 w-4 h-4 text-white" />
</template>

<script lang="ts">
import { shallowRef } from 'vue'
import { defineComponent } from 'vue'

import AvatarImage from '@/components/AvatarImage.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { deleteProduct, getProducts } from '@/services/ProductService'
import { getSupplierOptions } from '@/services/SupplierService'

export default defineComponent({
  components: { CrudTable, RSpinner },
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
          header: this.$t('order_code'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'order_code',
            sort: true,
            orderBy: 'order_code'
          }
        },
        {
          header: this.$t('name'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'name',
            sort: true,
            orderBy: 'name'
          }
        },
        {
          header: this.$t('pieces_ideal'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'pieces_ideal',
            sort: true,
            orderBy: 'pieces_ideal'
          }
        },
        {
          header: this.$t('pieces_critical'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'pieces_critical',
            sort: true,
            orderBy: 'pieces_critical'
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
      ],
      filterOptions: {},
      loading: true
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true

      const suppliers = await getSupplierOptions()
      const options = suppliers.data.map((supplier) => {
        return { id: supplier.id, label: supplier.label }
      })

      this.filterOptions = {
        'suppliers_id[]': {
          label: this.$t('Suppliers'),
          options: options
        }
      }
      this.loading = false
    }
  }
})
</script>
