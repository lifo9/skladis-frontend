<template>
  <div class="my-4">
    <r-filter v-if="filterOptions" :options="filterOptions" @filter="handleFilter" />
    <div class="my-4 flex flex-wrap items-center justify-start sm:justify-end">
      <r-search v-if="searchEnabled" class="m-2" @search="handleSearch" />
      <div v-for="(customGlobalAction, idx) in customGlobalActions" :key="'customGlobalAction_' + idx">
        <component :is="customGlobalAction.component" v-bind="customGlobalAction.props" />
      </div>
      <slot name="customButtons" :selected="selected" :rows="rows" :included="included"></slot>
      <r-button
        v-if="enableDefaultActions"
        class="m-2"
        variant="danger"
        size="small"
        :disabled="selected.length === 0"
        @click="deleteItems"
      >
        <span class="material-icons">delete</span>
        &nbsp;{{ $filters.uppercase($t('Delete')) }}&nbsp;
        <span v-if="selected.length > 0">{{ selected.length }}</span>
      </r-button>
      <navigation-item
        v-if="enableDefaultActions"
        class="m-2"
        :route-name="createRouteName"
        :label="$filters.uppercase($t('Create'))"
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
        :enable-default-actions="enableDefaultActions"
        :enable-custom-actions="customActions ? true : false"
        :order="order"
        :order-by="orderBy"
        :edit-route-name="editRouteName"
        :relationship-cols="filteredRelationshipCols"
        :included="included"
        :hidden-cols="hiddenCols"
        :custom-ordering-options="customOrderingOptions"
        :hide-all-cols="hideAllCols"
        :show-id="showId"
        :id-param-name="idParamName"
        @add-selected="handleAddSelected"
        @remove-selected="handleRemoveSelected"
        @delete-item="deleteItems"
        @order="changeOrder"
      >
        <template #customActions="{ row }">
          <div v-for="(customAction, idx) in customActions" :key="'customAction_' + idx">
            <component :is="customAction.component" :row="row" :included="included" :options="customAction.options" />
          </div>
        </template>
        <template #customColsBeforeHeaders>
          <th
            v-for="(customCol, idx) in customColsBefore"
            :key="'customColBeforeHeader_' + idx"
            :class="customCol.options && customCol.options.sort && customCol.options.orderBy ? 'cursor-pointer' : ''"
            @click="customColChangeOrder(customCol)"
          >
            <div class="flex items-center justify-start">
              <span>{{ customCol.header }}</span>
              <order-arrow
                v-if="
                  customCol.options &&
                  customCol.options.sort &&
                  customCol.options.orderBy &&
                  orderBy === customCol.options.orderBy
                "
                :order="order"
              />
            </div>
          </th>
        </template>
        <template #customColsBefore="{ row }">
          <td
            v-for="(customCol, idx) in customColsBefore"
            :key="'customColBefore_' + idx"
            :data-title="customCol.header"
            :class="customCol.header.length > 0 ? 'has-title' : ''"
          >
            <component :is="customCol.component" :options="customCol.options" :row="row" :included="included" />
          </td>
        </template>
        <template #customColsAfterHeaders>
          <th
            v-for="(customCol, idx) in customColsAfter"
            :key="'customColAfterHeader_' + idx"
            :class="customCol.options && customCol.options.sort && customCol.options.orderBy ? 'cursor-pointer' : ''"
            @click="customColChangeOrder(customCol)"
          >
            <div class="flex items-center justify-start">
              <span>{{ customCol.header }}</span>
              <order-arrow
                v-if="
                  customCol.options &&
                  customCol.options.sort &&
                  customCol.options.orderBy &&
                  orderBy === customCol.options.orderBy
                "
                :order="order"
              />
            </div>
          </th>
        </template>
        <template #customColsAfter="{ row }">
          <td
            v-for="(customCol, idx) in customColsAfter"
            :key="'customColAfter_' + idx"
            :data-title="customCol.header"
            :class="customCol.header.length > 0 ? 'has-title' : ''"
          >
            <component :is="customCol.component" :options="customCol.options" :row="row" :included="included" />
          </td>
        </template>
      </r-table>
      <r-pagination v-if="total > 1" :current="currentPage" :per-page="perPage" :total="total" @change="changePage" />
    </div>
    <div v-else class="my-4">
      <p>
        <b>0</b>
        {{ $t('results') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import NavigationItem from '@/components/NavigationItem.vue'
import RFilter from '@/components/RFilter.vue'
import OrderArrow from '@/components/ui/OrderArrow.vue'
import RButton from '@/components/ui/RButton.vue'
import RPagination from '@/components/ui/RPagination.vue'
import RSearch from '@/components/ui/RSearch.vue'
import RTable from '@/components/ui/RTable.vue'
import { arrayUnique } from '@/utils/helpers'
export default defineComponent({
  components: {
    RTable,
    RButton,
    NavigationItem,
    OrderArrow,
    RPagination,
    RSearch,
    RFilter
  },
  props: {
    getEndpoint: {
      type: Function,
      required: true
    },
    deleteEndpoint: {
      type: Function,
      default: function () {
        return false
      }
    },
    createRouteName: {
      type: String,
      default: undefined
    },
    editRouteName: {
      type: String,
      default: undefined
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
    customGlobalActions: {
      type: Array,
      default: undefined
    },
    enableDefaultActions: {
      type: Boolean,
      default: true
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
    },
    hideAllCols: {
      type: Boolean,
      default: false
    },
    filterOptions: {
      type: Object,
      default: undefined
    },
    searchEnabled: {
      type: Boolean,
      default: true
    },
    initialOrder: {
      type: String,
      default: undefined
    },
    initialOrderBy: {
      type: String,
      default: undefined
    },
    itemId: {
      type: Number,
      default: undefined
    },
    showId: {
      type: Boolean,
      default: false
    },
    idParamName: {
      type: String,
      default: 'id'
    }
  },
  data() {
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
      orderBy: 'id',
      filters: {}
    }
  },
  computed: {
    filteredHeaders() {
      if (this.hideAllCols) {
        return []
      } else if (!this.hiddenCols) {
        return this.headers.map((header) => {
          return { id: header, value: this.$t(header) }
        })
      } else {
        return this.headers
          .filter((header) => !this.hiddenCols.includes(header))
          .map((header) => {
            return { id: header, value: this.$t(header) }
          })
      }
    },
    filteredRelationshipCols() {
      if (this.hideAllCols) {
        return []
      } else if (!this.hiddenCols) {
        return this.relationshipCols
      } else {
        return this.relationshipCols
          ? this.relationshipCols.filter((col) => !this.hiddenCols.includes(col.relationship))
          : undefined
      }
    },
    customOrderingOptions() {
      const colsBefore = this.customColsBefore
        ? this.customColsBefore
            .filter((col) => col.options && col.options.orderBy && col.options.sort)
            .map((col) => {
              return { id: col.options.orderBy, value: col.header }
            })
        : []

      const colsAfter = this.customColsAfter
        ? this.customColsAfter
            .filter((col) => col.options && col.options.orderBy && col.options.sort)
            .map((col) => {
              return { id: col.options.orderBy, value: col.header }
            })
        : []

      return [...colsBefore, ...colsAfter]
    }
  },
  mounted() {
    this.handlePageQuery()
    this.handleSearchQuery()
    this.handleOrderQuery()

    // ugly hack to prevent double fetching
    if (!this.filterOptions) {
      this.fetchData()
    }

    this.eventBus.on('filter', (filter) => {
      this.handleFilter(filter)
    })

    this.eventBus.on('reloadCrudTable', () => {
      this.fetchData()
    })
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.notFound = false

      let params = {
        page: this.currentPage,
        perPage: this.perPage,
        searchQuery: this.searchQuery,
        order: this.order,
        orderBy: this.orderBy,
        filters: this.filters
      }

      if (this.itemId) {
        params['id'] = this.itemId
      }

      const rows = await this.getEndpoint(params)
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
    changePage(page) {
      let query = { ...this.$route.query }
      query['page'] = page

      this.$router.push({ path: this.$route.path, query: query })

      this.currentPage = page
      this.fetchData()
    },
    handleAddSelected(selected) {
      this.selected = arrayUnique(this.selected.concat(selected))
    },
    handleRemoveSelected(selected) {
      this.selected = this.selected.filter((s) => selected.indexOf(s) === -1)
    },
    handleSearch(searchQuery) {
      this.searchQuery = searchQuery

      if (this.currentPage !== 1) {
        this.currentPage = 1
      }

      this.fetchData()
    },
    handleSearchQuery() {
      const searchQuery = this.$route.query['search']

      if (searchQuery) {
        this.searchQuery = searchQuery

        if (this.currentPage !== 1) {
          this.currentPage = 1
        }
      }
    },
    handlePageQuery() {
      const pageQuery = this.$route.query['page']

      if (pageQuery) {
        this.currentPage = parseInt(pageQuery)
      }
    },
    handleOrderQuery() {
      const orderByQuery = this.$route.query['order_by']
      const orderQuery = this.$route.query['order']

      if (orderByQuery || orderQuery) {
        if (orderByQuery) {
          this.orderBy = orderByQuery
        }

        if (orderQuery) {
          this.order = orderQuery
        }

        if (this.currentPage !== 1) {
          this.currentPage = 1
        }
      } else if (this.initialOrder || this.initialOrderBy) {
        if (this.initialOrderBy) {
          this.orderBy = this.initialOrderBy
        }

        if (this.initialOrder) {
          this.order = this.initialOrder
        }

        if (this.currentPage !== 1) {
          this.currentPage = 1
        }
      }
    },
    async deleteItems(id) {
      this.$vfm.show({
        component: 'ConfirmationModal',
        on: {
          'confirm': (close) => {
            const toDelete = typeof id === 'string' ? [id] : this.selected
            Promise.all(toDelete.map((id) => this.deleteEndpoint(id)))
              .then((results) => {
                if (
                  results.reduce((_total, value) => {
                    return value.status === 204
                  })
                ) {
                  this.eventBus.emit('alert', { level: 'success', message: this.$t('Items were successfully deleted') })
                }
              })
              .catch((error) => {
                this.eventBus.emit('alert', { level: 'alert', message: error })
              })
              .finally(() => {
                this.selected = []
                this.fetchData()
              })
            close()
          },
          cancel(close) {
            close()
          }
        }
      })
    },
    customColChangeOrder(customCol) {
      if (customCol.options && customCol.options.sort && customCol.options.orderBy) {
        this.changeOrder({
          orderBy: customCol.options.orderBy,
          order: this.order === 'asc' ? 'desc' : 'asc'
        })
      }
    },
    changeOrder(order) {
      this.order = order.orderBy !== this.orderBy ? this.order : order.order
      this.orderBy = order.orderBy

      let query = { ...this.$route.query }
      query['order'] = this.order
      query['order_by'] = this.orderBy

      this.$router.push({ path: this.$route.path, query: query })

      this.fetchData()
    },
    handleFilter(filters) {
      this.filters = filters

      if (Object.keys(filters).length > 0) {
        if (this.currentPage !== 1) {
          this.currentPage = 1
        }
      }

      this.fetchData()
    }
  }
})
</script>
