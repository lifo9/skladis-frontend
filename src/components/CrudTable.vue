<template>
  <div class="my-4">
    <div class="flex flex-wrap items-center justify-start my-4 sm:justify-end">
      <search class="m-2" @search="handleSearch" />
      <r-button
        class="m-2"
        variant="danger"
        size="small"
        :disabled="selected.length === 0"
        @click="deleteItems"
      >
        <span class="material-icons">delete</span>&nbsp;{{
          $t('Delete').toUpperCase()
        }}&nbsp;
        <span v-if="selected.length > 0">{{ selected.length }}</span>
      </r-button>
      <navigation-item
        class="m-2"
        :route-name="createRouteName"
        :label="$t('Create').toUpperCase()"
        icon="add"
        type="button"
        size="small"
      />
    </div>
    <div v-if="!notFound">
      <r-table
        :headers="headers"
        :rows="rows"
        :loading="loading"
        :bulk-select="bulkSelect"
        :selected="selected"
        :actions="true"
        :order="order"
        :orderBy="orderBy"
        @addSelected="handleAddSelected"
        @removeSelected="handleRemoveSelected"
        @deleteItem="deleteItems"
        @order="changeOrder"
      />
      <pagination
        v-if="total > 1"
        :current="currentPage"
        :per-page="perPage"
        :total="total"
        @change="changePage"
      />
    </div>
    <div v-else class="my-4">
      <p><b>0</b> {{ $t('results') }}</p>
    </div>
  </div>
</template>

<script>
import Pagination from './ui/Pagination.vue'
import RTable from './ui/RTable.vue'
import { arrayUnique } from '../backend/utils/helpers'
import RButton from './ui/RButton.vue'
import ConfirmationModal from './ui/ConfirmationModal.vue'
import NavigationItem from './NavigationItem.vue'
import Search from './ui/Search.vue'

export default {
  components: { RTable, Pagination, RButton, NavigationItem, Search },
  props: {
    getEndpoint: {
      type: Function,
      required: true
    },
    deleteEndpoint: {
      type: Function,
      required: true
    },
    createRouteName: {
      type: String,
      required: true
    },
    bulkSelect: {
      type: Boolean,
      default: false
    },
    perPage: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      loading: false,
      notFound: false,
      headers: [],
      rows: [],
      selected: [],
      searchQuery: '',
      currentPage: 1,
      total: 0,
      order: 'asc',
      orderBy: 'id'
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true
      this.notFound = false

      const rows = await this.getEndpoint({
        page: this.currentPage,
        perPage: this.perPage,
        searchQuery: this.searchQuery,
        order: this.order,
        orderBy: this.orderBy
      })
      const data = rows.data.data
      const headers = rows.headers

      if (data.length > 0) {
        this.headers = Object.keys(data[0].attributes)
        this.rows = data
        this.total = parseInt(headers['total'])
      } else {
        this.notFound = true
      }

      this.loading = false
    },
    changePage (page) {
      this.currentPage = page
      this.fetchData()
    },
    handleAddSelected (selected) {
      this.selected = arrayUnique(this.selected.concat(selected))
    },
    handleRemoveSelected (selected) {
      this.selected = this.selected.filter(s => selected.indexOf(s) === -1)
    },
    handleSearch (searchQuery) {
      this.searchQuery = searchQuery
      this.fetchData()
    },
    async deleteItems (id) {
      const confirmation = await this.$modal(ConfirmationModal)
      if (confirmation) {
        const toDelete = typeof id === 'string' ? [id] : this.selected
        Promise.all(toDelete.map(id => this.deleteEndpoint(id)))
          .then(results => {
            if (
              results.reduce((_total, value) => {
                return value.status === 204
              })
            ) {
              this.$root.$emit(
                'alert',
                'success',
                this.$t('Items were successfully deleted')
              )
            }
          })
          .catch(error => {
            this.$root.$emit('alert', 'alert', error)
          })
          .finally(() => {
            this.selected = []
            this.fetchData()
          })
      }
    },
    changeOrder (order) {
      this.order = order.orderBy !== this.orderBy ? this.order : order.order
      this.orderBy = order.orderBy
      this.fetchData()
    }
  }
}
</script>
