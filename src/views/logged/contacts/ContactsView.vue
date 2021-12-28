<template>
  <div>
    <h1
      class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate"
    >
      {{ $t('Contacts') }}
    </h1>
    <crud-table :get-endpoint="getEndpoint" :bulk-select="true" />
  </div>
</template>

<script>
import CrudTable from '../../../components/CrudTable.vue'
import { getContacts } from '../../../backend/services/ContactsService'

export default {
  components: { CrudTable },
  data () {
    return {
      getEndpoint: getContacts
    }
  }
}
</script>
