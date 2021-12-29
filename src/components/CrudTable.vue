<template>
  <div v-if="!notFound" class="my-4">
    <div class="flex flex-wrap items-center justify-end my-4 space-x-4">
      <r-button
        variant="danger"
        :disabled="selected.length === 0"
        @click="deleteSelected"
      >
        {{ $t('Delete').toUpperCase() }}&nbsp;
        <span v-if="selected.length > 0">{{ selected.length }}</span>
      </r-button>
      <navigation-item
        route-name="ContactsCreate"
        :label="$t('Create').toUpperCase()"
        type="button"
      />
    </div>
    <r-table
      :headers="headers"
      :rows="contacts"
      :loading="loading"
      :bulk-select="bulkSelect"
      :selected="selected"
      @addSelected="handleAddSelected"
      @removeSelected="handleRemoveSelected"
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
</template>

<script>
import Pagination from './ui/Pagination.vue'
import RTable from './ui/RTable.vue'
import { arrayUnique } from '../backend/utils/helpers'
import RButton from './ui/RButton.vue'
import ConfirmationModal from './ui/ConfirmationModal.vue'
import NavigationItem from './NavigationItem.vue'

export default {
  components: { RTable, Pagination, RButton, NavigationItem },
  props: {
    getEndpoint: {
      type: Function,
      required: true
    },
    deleteEndpoint: {
      type: Function,
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
      contacts: [],
      selected: [],
      currentPage: 1,
      total: 0
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true
      this.notFound = false

      const contacts = await this.getEndpoint({
        page: this.currentPage,
        perPage: this.perPage
      })
      const data = contacts.data.data
      const headers = contacts.headers

      if (data.length > 0) {
        this.headers = Object.keys(data[0].attributes)
        this.contacts = data
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
    async deleteSelected () {
      const confirmation = await this.$modal(ConfirmationModal)
      if (confirmation) {
        Promise.all(this.selected.map(id => this.deleteEndpoint(id)))
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
    }
  }
}
</script>
