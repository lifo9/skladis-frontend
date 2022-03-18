<template>
  <crud-table
    v-if="!loading"
    :get-endpoint="getEndpoint"
    :enable-default-actions="false"
    :enable-global-actions="false"
    :hide-all-cols="true"
    :custom-cols-before="customCols"
    :bulk-select="false"
    :search-enabled="false"
    :filter-options="filterOptions"
    :filter-placeholder="$t('item_type')"
  />
  <r-spinner v-else class="mr-3 ml-1 w-4 h-4 text-white" />
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'

import AvatarImage from '@/components/AvatarImage.vue'
import CrudLink from '@/components/CrudLink.vue'
import CrudTable from '@/components/CrudTable.vue'
import CrudText from '@/components/CrudText.vue'
import { getAuditOptions, getAudits } from '@/services/AuditsService'
import { getUserOptions } from '@/services/UsersService'

export default defineComponent({
  components: { CrudTable },
  data() {
    return {
      loading: false,
      getEndpoint: getAudits,
      customCols: [
        {
          header: '',
          component: shallowRef(AvatarImage),
          options: {
            relationship: 'user',
            attribute: 'avatar',
            rounded: true
          }
        },
        {
          header: this.$t('User'),
          component: shallowRef(CrudLink),
          options: {
            relationship: 'user',
            attribute: ['first_name', 'last_name'],
            editLink: true,
            editRouteName: 'UserEdit',
            sort: false
          }
        },
        {
          header: this.$t('created_at'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'created_at',
            sort: true,
            orderBy: 'created_at',
            format: this.$filters.formatDateTime
          }
        },
        {
          header: this.$t('item_type'),
          component: shallowRef(CrudLink),
          options: {
            attribute: 'item_type',
            editLink: true,
            dynamicEditRoute: 'item_type',
            editLinkIdColumn: 'item_id',
            translate: true,
            sort: true,
            orderBy: 'item_type'
          }
        },
        {
          header: this.$t('event'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'event',
            sort: true,
            orderBy: 'event',
            translate: true
          }
        },
        {
          header: this.$t('changeset'),
          component: shallowRef(CrudText),
          options: {
            attribute: 'changeset',
            format: this.$filters.formatAuditChanges,
            json: true
          }
        }
      ],
      filterOptions: undefined
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true

      const types = await getAuditOptions()
      const typeOptions = types.data.map((supplier) => {
        return { id: supplier.id, label: this.$t(supplier.label) }
      })

      const users = await getUserOptions()
      const userOptions = users.data.map((supplier) => {
        return { id: supplier.id, label: this.$t(supplier.label) }
      })

      const events = ['create', 'update', 'destroy'].map((event) => {
        return { id: event, label: this.$t(event) }
      })

      this.filterOptions = {
        'version_item_type[]': {
          label: this.$t('item_type'),
          options: typeOptions
        },
        'version_event[]': {
          label: this.$t('event'),
          options: events
        },
        'version_whodunnit[]': {
          label: this.$t('User'),
          options: userOptions
        }
      }
      this.loading = false
    }
  }
})
</script>
