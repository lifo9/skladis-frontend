<template>
  <div>
    <r-table :headers="headers" :rows="contacts" :loading="loading" />
    <pagination
      v-if="contacts.length > 1"
      :current="currentPage"
      :per-page="perPage"
      :total="total"
      @change="changePage"
    />
  </div>
</template>

<script>
import { getContacts } from '../../../backend/services/ContactsService'
import Pagination from '../../ui/Pagination.vue'
import RTable from '../../ui/RTable.vue'

export default {
  components: { RTable, Pagination },
  data () {
    return {
      loading: false,
      headers: [],
      contacts: [],
      currentPage: 1,
      perPage: 0,
      total: 0
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true

      const contacts = await getContacts(this.currentPage)
      const data = contacts.data.data
      const headers = contacts.headers

      if (data.length > 0) {
        this.headers = Object.keys(data[0].attributes)
        this.contacts = data
        this.perPage = parseInt(headers['per-page'])
        this.total = parseInt(headers['total'])
      }

      this.loading = false
    },
    changePage (page) {
      this.currentPage = page
      this.fetchData()
    }
  }
}
</script>
