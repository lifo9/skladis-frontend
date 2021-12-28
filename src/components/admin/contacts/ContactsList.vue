<template>
  <div v-if="!notFound" class="my-4">
    <r-table
      :headers="headers"
      :rows="pagedContacts"
      :loading="loading"
      :bulk-select="bulkSelect"
      :selected="selected"
      @addSelected="handleAddSelected"
      @removeSelected="handleRemoveSelected"
    />
    <pagination
      v-if="contacts.length && total > perPage"
      :current="currentPage"
      :per-page="perPage"
      :total="total"
      @change="changePage"
    />
  </div>
  <div v-else class="my-4">
    <p><b>0</b> {{ $t('results') }}</p>
  </div>
</template>

<script>
import { getContacts } from '../../../backend/services/ContactsService'
import Pagination from '../../ui/Pagination.vue'
import RTable from '../../ui/RTable.vue'
import { arrayUnique } from '../../../backend/utils/helpers'

export default {
  components: { RTable, Pagination },
  data () {
    return {
      loading: false,
      notFound: false,
      headers: [],
      contacts: [],
      selected: [],
      currentPage: 1,
      currentApiPage: undefined,
      apiPerPage: undefined,
      total: 0,
      // future props
      perPage: 29,
      bulkSelect: false
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {
    pagedContacts () {
      let from = 0
      let to = 0

      if (this.perPage <= this.apiPerPage) {
        const current =
          this.currentPage === 1
            ? 1
            : this.currentPage % this.normalizedPerPage === 0
              ? this.normalizedPerPage
              : this.currentPage % this.normalizedPerPage
        from = (current - 1) * this.perPage
        to = current * this.perPage
      }

      return this.contacts.slice(from, to)
    },
    normalizedPerPage () {
      return Math.ceil(this.apiPerPage / this.perPage)
    }
  },
  methods: {
    async fetchData () {
      this.loading = true
      this.notFound = false

      const apiPage = this.apiPerPage
        ? Math.ceil(this.currentPage / this.normalizedPerPage)
        : 1
      const contacts = await getContacts(apiPage)
      const data = contacts.data.data
      const headers = contacts.headers

      if (data.length > 0) {
        this.headers = Object.keys(data[0].attributes)
        this.contacts = data
        this.currentApiPage = apiPage
        this.apiPerPage = parseInt(headers['per-page'])
        this.total = parseInt(headers['total'])
      } else {
        this.notFound = true
      }

      this.loading = false
    },
    changePage (page) {
      this.currentPage = page

      if (this.perPage <= this.apiPerPage) {
        const range = Array.from(new Array(this.normalizedPerPage), (x, i) =>
          Math.abs(i - this.normalizedPerPage * this.currentApiPage)
        )
        if (!range.includes(page)) {
          this.fetchData()
        }
      }
    },
    handleAddSelected (selected) {
      this.selected = arrayUnique(this.selected.concat(selected))
    },
    handleRemoveSelected (selected) {
      this.selected = this.selected.filter(s => selected.indexOf(s) === -1)
    }
  }
}
</script>
