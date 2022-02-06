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
          $t('Delete') | uppercase
        }}&nbsp;
        <span v-if="selected.length > 0">{{ selected.length }}</span>
      </r-button>
      <navigation-item
        class="m-2"
        :route-name="createRouteName"
        :label="$t('Create') | uppercase"
        icon="add"
        type="button"
        size="small"
      />
    </div>
    <div v-if="!notFound && filteredHeaders">
      <r-table
        :headers="filteredHeaders"
        :rows="rows"
        :loading="loading"
        :bulk-select="bulkSelect"
        :selected="selected"
        :actions="true"
        :order="order"
        :orderBy="orderBy"
        :editRouteName="editRouteName"
        :relationship-cols="relationshipCols"
        :included="included"
        :hiddenCols="hiddenCols"
        @addSelected="handleAddSelected"
        @removeSelected="handleRemoveSelected"
        @deleteItem="deleteItems"
        @order="changeOrder"
      >
        <template v-slot:customActions="{ row }">
          <div
            v-for="(customAction, idx) in customActions"
            :key="'customAction_' + idx"
          >
            <component v-bind:is="customAction" :row="row"></component>
          </div>
        </template>
        <template v-slot:customColsBeforeHeaders>
          <th
            v-for="(customCol, idx) in customColsBefore"
            :key="'customColBeforeHeader_' + idx"
          >
            <div class="flex items-center justify-start">
              <span>{{ customCol.header }}</span>
            </div>
          </th>
        </template>
        <template v-slot:customColsBefore="{ row }">
          <td
            v-for="(customCol, idx) in customColsBefore"
            :key="'customColBefore_' + idx"
            :data-title="customCol.header"
            :class="customCol.header.length > 0 ? 'has-title' : ''"
          >
            <component
              v-bind:is="customCol.component"
              :options="customCol.options"
              :row="row"
            ></component>
          </td>
        </template>
        <template v-slot:customColsAfterHeaders>
          <th
            v-for="(customCol, idx) in customColsAfter"
            :key="'customColAfterHeader_' + idx"
          >
            <div class="flex items-center justify-start">
              <span>{{ customCol.header }}</span>
            </div>
          </th>
        </template>
        <template v-slot:customColsAfter="{ row }">
          <td
            v-for="(customCol, idx) in customColsAfter"
            :key="'customColAfter_' + idx"
            :data-title="customCol.header"
            :class="customCol.header.length > 0 ? 'has-title' : ''"
          >
            <component
              v-bind:is="customCol.component"
              :options="customCol.options"
              :row="row"
            ></component>
          </td>
        </template>
      </r-table>
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
import {
  arrayUnique,
  enableScroll,
  disableScroll
} from '../backend/utils/helpers'
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
    editRouteName: {
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
    },
    customActions: {
      type: Array,
      default: undefined
    },
    relationshipCols: {
      type: Array,
      default: undefined
    },
    hiddenCols: {
      type: Array,
      default: undefined
    },
    customColsBefore: {
      type: Array,
      default: undefined
    },
    customColsAfter: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      loading: false,
      notFound: false,
      headers: [],
      rows: [],
      included: [],
      selected: [],
      searchQuery: '',
      currentPage: 1,
      total: 0,
      order: 'asc',
      orderBy: 'id'
    }
  },
  computed: {
    filteredHeaders () {
      if (!this.hiddenCols) {
        return this.headers
      }

      return this.headers.filter(header => !this.hiddenCols.includes(header))
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
      const included = rows.data.included
      const headers = rows.headers

      if (included && included.length > 0) {
        this.included = included
      }

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
      disableScroll()
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
      enableScroll()
    },
    changeOrder (order) {
      this.order = order.orderBy !== this.orderBy ? this.order : order.order
      this.orderBy = order.orderBy
      this.fetchData()
    }
  }
}
</script>
