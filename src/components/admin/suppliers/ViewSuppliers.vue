<template>
  <crud-table
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="SupplierCreate"
    edit-route-name="SupplierEdit"
    :bulk-select="true"
    :hideAllCols="true"
    :relationshipCols="relationshipCols"
    :customColsAfter="customCols"
  />
</template>

<script>
import CrudTable from '../../../components/CrudTable.vue'
import {
  getSuppliers,
  deleteSupplier
} from '../../../backend/services/SupplierService'
import CrudLink from '../../CrudLink.vue'
import CrudText from '../../CrudText.vue'

export default {
  components: { CrudTable },
  data () {
    return {
      getEndpoint: getSuppliers,
      deleteEndpoint: deleteSupplier,
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
          component: CrudLink,
          options: {
            attribute: 'name',
            linkAttribute: 'url',
            sort: true
          }
        },
        {
          header: this.$t('ico'),
          component: CrudText,
          options: {
            attribute: 'ico',
            sort: true
          }
        },
        {
          header: this.$t('dic'),
          component: CrudText,
          options: {
            attribute: 'dic',
            sort: true
          }
        },
        {
          header: this.$t('free_delivery_from'),
          component: CrudText,
          options: {
            attribute: 'free_delivery_from',
            sort: true
          }
        },
        {
          header: this.$t('contact'),
          component: CrudLink,
          options: {
            relationship: 'contact',
            attribute: ['first_name', 'last_name'],
            editLink: true,
            editRouteName: 'ContactsEdit'
          }
        },
        {
          header: this.$t('street_name'),
          component: CrudText,
          options: {
            relationship: 'address',
            attribute: 'street_name',
            sort: true,
            orderBy: 'addresses.street_name'
          }
        },
        {
          header: this.$t('street_number'),
          component: CrudText,
          options: {
            relationship: 'address',
            attribute: 'street_number',
            sort: true,
            orderBy: 'addresses.street_number'
          }
        },
        {
          header: this.$t('city'),
          component: CrudText,
          options: {
            relationship: 'address',
            attribute: 'city',
            sort: true,
            orderBy: 'addresses.city'
          }
        },
        {
          header: this.$t('country'),
          component: CrudText,
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
}
</script>
