<template>
  <crud-table
    v-if="!loading"
    :get-endpoint="getEndpoint"
    :delete-endpoint="deleteEndpoint"
    create-route-name="SupplierCreate"
    edit-route-name="SupplierEdit"
    :bulk-select="true"
    :hide-all-cols="true"
    :relationship-cols="relationshipCols"
    :custom-cols-after="customCols"
    :custom-actions="customActions"
    :filter-options="filterOptions"
  />
  <r-spinner v-else class="mr-3 ml-1 w-4 h-4 text-white" />
</template>

<script lang="ts">
import { markRaw, shallowRef } from 'vue'
import { defineComponent } from 'vue'

import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import CrudViewButton from '@/components/CrudViewButton.vue'
import RSpinner from '@/components/ui/RSpinner.vue'
import { getContactOptions } from '@/services/ContactsService'
import { deleteSupplier, getSuppliers } from '@/services/SupplierService'

export default defineComponent({
  components: { CrudTable, RSpinner },
  data() {
    return {
      loading: false,
      getEndpoint: getSuppliers,
      deleteEndpoint: deleteSupplier,
      filterOptions: undefined,
      customActions: [
        {
          component: markRaw(CrudViewButton),
          options: {
            route: 'ProductsView',
            label: this.$filters.uppercase(this.$t('Products')),
            customClass: 'bg-green-600 hover:bg-green-500 focus:border-green-700 active:bg-green-400',
            query: 'suppliers_id[]'
          }
        }
      ],
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
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true

      const contacts = await getContactOptions()
      const contactOptions = contacts.data.map((contact) => {
        return { id: contact.id, label: contact.label }
      })

      this.filterOptions = {
        'contact_id[]': {
          label: this.$t('Contact'),
          options: contactOptions
        }
      }

      this.loading = false
    }
  }
})
</script>
