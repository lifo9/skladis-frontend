<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="SupplierCreate"
    edit-route-name="SupplierEdit"
    :bulk-select="true"
    :hide-all-cols="true"
    :relationship-cols="relationshipCols"
    :custom-cols-after="customCols"
    :custom-actions="customActions"
  />
</template>

<script lang="ts">
import { markRaw, shallowRef } from 'vue'
import { defineComponent } from 'vue'

import ViewSupplierProducts from '@/components/admin/suppliers/ViewSupplierProducts.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import { deleteSupplier, getSuppliers } from '@/services/SupplierService'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      getEndpoint: getSuppliers,
      deleteEndpoint: deleteSupplier,
      customActions: [{ component: markRaw(ViewSupplierProducts) }],
      relationshipCols: [
        {
          relationship: 'address',
          relationship_type: 'address',
          table_name: 'addresses',
          attributes: [
            { id: 'street_name', label: this.$t('street_name') },
            { id: 'street_number', label: this.$t('street_number') },
            { id: 'city', label: this.$t('city') }
          ]
        }
      ],
      customCols: [
        {
          header: this.$t('name'),
          component: shallowRef(CrudLink),
          options: {
            attribute: 'name',
            linkAttribute: 'url',
            newTab: true,
            sort: true,
            orderBy: 'name'
          }
        },
        {
          header: this.$t('ico'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'ico',
            sort: true,
            orderBy: 'ico'
          }
        },
        {
          header: this.$t('dic'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'dic',
            sort: true,
            orderBy: 'dic'
          }
        },
        {
          header: this.$t('free_delivery_from'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'free_delivery_from',
            sort: true,
            orderBy: 'free_delivery_from'
          }
        },
        {
          header: this.$t('contact'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'contact',
            attribute: ['first_name', 'last_name'],
            editLink: true,
            editRouteName: 'ContactEdit'
          }
        },
        {
          header: this.$t('street_name'),
          component: shallowRef(CrudText),
          options: {
            relationship: 'address',
            attribute: 'street_name',
            sort: true,
            orderBy: 'addresses.street_name'
          }
        },
        {
          header: this.$t('street_number'),
          component: shallowRef(CrudText),
          options: {
            relationship: 'address',
            attribute: 'street_number',
            sort: true,
            orderBy: 'addresses.street_number'
          }
        },
        {
          header: this.$t('city'),
          component: shallowRef(CrudText),
          options: {
            relationship: 'address',
            attribute: 'city',
            sort: true,
            orderBy: 'addresses.city'
          }
        },
        {
          header: this.$t('country'),
          component: shallowRef(CrudText),
          options: {
            relationship: 'address',
            attribute: 'country',
            sort: true,
            orderBy: 'addresses.country'
          }
        }
      ]
    }
  }
})
</script>
