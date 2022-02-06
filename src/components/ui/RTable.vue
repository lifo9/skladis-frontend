<template>
  <div v-if="!loading" class="overflow-auto rounded sm:shadow">
    <table>
      <thead>
        <tr>
          <th class="ordering">
            <div class="flex items-center justify-between w-full">
              {{ $t('Order') }}
              <div class="flex flex-wrap items-center justify-end">
                <r-select
                  :options="orderingOptions"
                  :disableDefaultOption="true"
                  :value="orderBy"
                  @input="changeOrder"
                />
                <order-arrow
                  class="ml-2 text-3xl"
                  :order="order"
                  @click="changeOrder(orderBy)"
                />
              </div>
            </div>
          </th>
          <th v-if="bulkSelect" scope="col" class="sm:w-16 bulk-select">
            <span class="sm:hidden">{{ $t('Select All') }} &nbsp;</span>
            <r-input
              class="flex flex-wrap items-center justify-start w-6 ml-auto sm:justify-center sm:ml-0"
              type="checkbox"
              @change="selectAll"
              :value="isSelectedAll"
            />
          </th>
          <th
            v-if="rows.length > 0 && rows[0].id"
            @click="changeOrder('id')"
            class="cursor-pointer"
          >
            <div class="flex items-center justify-start">
              <span>ID</span>
              <order-arrow v-if="orderBy === 'id'" :order="order" />
            </div>
          </th>
          <slot name="customColsBeforeHeaders" />
          <th
            v-for="header in parsedHeaders"
            :key="header"
            scope="col"
            class="cursor-pointer"
            @click="changeOrder(header)"
          >
            <div class="flex items-center justify-start">
              {{ $t(header) }}
              <order-arrow v-if="orderBy === header" :order="order" />
            </div>
          </th>
          <slot name="customColsAfterHeaders" />
          <th v-if="actions" scope="col">
            {{ $t('Actions') }}
          </th>
        </tr>
      </thead>
      <br v-if="bulkSelect" class="sm:hidden" />
      <tbody>
        <tr v-for="(row, idx1) in rows" :key="row.id ? row.id : idx1">
          <td
            v-if="bulkSelect"
            :data-title="$t('Select')"
            class="flex flex-wrap items-center justify-end sm:table-cell has-title"
          >
            <r-input
              type="checkbox"
              :value="isSelected(row.id)"
              @change="select(row.id, $event)"
            />
          </td>
          <td v-if="row.id" :data-title="$t('ID')" class="has-title">
            {{ row.id }}
          </td>
          <slot :row="getUnfilteredRowById(row.id)" name="customColsBefore" />
          <td
            v-for="(col, idx2) in extractedRowData[idx1]"
            :key="idx2"
            :data-title="$t(idx2)"
            class="has-title"
          >
            <span
              v-if="typeof col === 'boolean'"
              class="font-bold material-icons"
              :class="col ? 'text-green-600' : 'text-red-600'"
              >{{ col ? 'check' : 'close' }}</span
            >
            <span v-else>{{ col | arrayToString }}</span>
          </td>
          <slot :row="getUnfilteredRowById(row.id)" name="customColsAfter" />
          <td v-if="actions" :data-title="$t('Actions')" class="actions">
            <div class="flex flex-wrap items-center justify-start w-max">
              <slot :row="getUnfilteredRowById(row.id)" name="customActions" />
              <navigation-item
                :routeName="editRouteName"
                :params="{ id: row.id }"
                class="m-1"
                type="button"
                size="verySmall"
                icon="edit"
                label=""
              ></navigation-item>
              <r-button
                variant="danger"
                size="verySmall"
                class="m-1"
                @click="deleteItem(row.id)"
              >
                <span class="material-icons">delete</span>
              </r-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="flex flex-wrap items-center justify-center my-4">
    <spinner class="w-16 h-16 my-4 text-gray-800" />
  </div>
</template>

<script>
import NavigationItem from '../NavigationItem.vue'
import OrderArrow from './OrderArrow.vue'
import RButton from './RButton.vue'
import RInput from './RInput.vue'
import RSelect from './RSelect.vue'
import Spinner from './Spinner.vue'

export default {
  components: {
    Spinner,
    RInput,
    RButton,
    NavigationItem,
    OrderArrow,
    RSelect
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    },
    actions: {
      type: Boolean,
      default: false
    },
    bulkSelect: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: undefined
    },
    orderBy: {
      type: String,
      default: 'id'
    },
    order: {
      type: String,
      default: 'asc'
    },
    editRouteName: {
      type: String,
      default: undefined
    },
    relationshipCols: {
      type: Array,
      default: undefined
    },
    included: {
      type: Array,
      default: undefined
    },
    hiddenCols: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      currentlySelected: []
    }
  },
  updated () {
    this.currentlySelected = this.selected
  },
  computed: {
    isSelectedAll () {
      return this.rows.every(row => this.selected.includes(row.id))
    },
    orderingOptions () {
      const options = ['id'].concat(this.parsedHeaders).map(header => {
        return {
          id: header,
          value: header === 'id' ? 'ID' : this.$t(header)
        }
      })
      return options
    },
    parsedHeaders () {
      const customHeaders = this.relationshipCols
        ? this.relationshipCols
          .map(header => header.attributes.map(attr => attr.label))
          .flat()
        : []
      return this.headers.concat(customHeaders)
    },
    extractedRowData () {
      let extractedData = []

      this.rows.forEach(row => {
        const attributes = row.attributes
          ? Object.fromEntries(
            Object.entries(row.attributes).filter(
              ([key]) => !this.hiddenCols || !this.hiddenCols.includes(key)
            )
          )
          : row
        const relationships = row.relationships
        let customAttributes = {}

        for (let relationship in relationships) {
          const relIds = relationships[relationship].data.map(rel => rel.id)
          const headerAttributes = this.relationshipCols
            .filter(header => header.relationship === relationship)
            .map(header => header.attributes)

          if (headerAttributes.length === 1) {
            headerAttributes[0].forEach(attr => {
              customAttributes[attr.label] = relIds.map(id =>
                this.getAttributeValueFromIncluded(id, 'role', attr.id)
              )
            })
          }
        }

        extractedData.push({ ...attributes, ...customAttributes })
      })

      return extractedData
    }
  },
  methods: {
    select (rowId, checked) {
      if (checked) {
        this.currentlySelected.push(rowId)
        this.$emit('addSelected', this.currentlySelected)
      } else {
        const index = this.currentlySelected.indexOf(rowId)
        if (index !== -1) {
          this.currentlySelected.splice(index, 1)
        }
        this.$emit('removeSelected', rowId)
      }
    },
    selectAll (checked) {
      const rowIds = this.rows.map(row => row.id)

      if (checked) {
        this.currentlySelected = rowIds
        this.$emit('addSelected', rowIds)
      } else {
        this.currentlySelected = []
        this.$emit('removeSelected', rowIds)
      }
    },
    deleteItem (rowId) {
      this.$emit('deleteItem', rowId)
    },
    changeOrder (orderBy) {
      this.$emit('order', {
        orderBy: orderBy,
        order: this.order === 'asc' ? 'desc' : 'asc'
      })
    },
    isSelected (rowId) {
      return this.currentlySelected.includes(rowId)
    },
    getAttributeValueFromIncluded (id, type, attribute) {
      const attr = this.included.filter(
        inc => inc.type === type && inc.id === id
      )

      if (attr.length === 1) {
        return attr[0].attributes[attribute]
      }
    },
    getUnfilteredRowById (id) {
      const rows = this.rows.filter(row => {
        return row.attributes && row.id === id
      })

      if (rows.length === 1) {
        return rows[0]
      }
      return {}
    }
  }
}
</script>

<style lang="postcss" scoped>
table {
  @apply min-w-full;
}
thead {
  @apply text-white bg-gray-800;
}
thead tr > th {
  @apply hidden sm:table-cell;
}
thead tr > th.bulk-select {
  @apply flex sm:table-cell;
}
thead tr > th.ordering {
  @apply flex sm:hidden;
}
th {
  @apply px-4 py-3 text-xs font-medium tracking-wider text-left uppercase select-none;
}
tbody {
  @apply bg-white;
}
tbody tr {
  @apply flex flex-wrap sm:table-row mb-4 border-b border-gray-300;
}

td {
  @apply relative w-full px-4 sm:py-4 text-sm break-words sm:w-auto pb-2;
}
td.has-title {
  @apply pt-8 sm:py-4;
}
td.actions {
  @apply sm:p-1;
}

@media (max-width: 640px) {
  td.has-title:before {
    @apply px-2 py-1 text-xs font-medium tracking-wider text-left uppercase absolute top-0 left-0 text-white bg-gray-800;
    content: attr(data-title);
  }
}
</style>
