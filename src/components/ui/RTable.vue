<template>
  <div v-if="!loading" class="overflow-auto rounded sm:shadow">
    <table>
      <thead>
        <tr>
          <th class="ordering">
            <div class="flex justify-between items-center w-full">
              {{ $t('Order') }}
              <div class="flex flex-wrap justify-end items-center">
                <r-select
                  :options="orderingOptions"
                  :disable-default-option="true"
                  :value="orderBy"
                  @input="changeOrder"
                />
                <order-arrow class="ml-2 text-3xl" :order="order" @click="changeOrder(orderBy)" />
              </div>
            </div>
          </th>
          <th v-if="bulkSelect" scope="col" class="sm:w-16 bulk-select">
            <span class="sm:hidden">{{ $t('Select All') }} &nbsp;</span>
            <r-input
              class="flex flex-wrap justify-start items-center ml-auto w-6 sm:justify-center sm:ml-0"
              type="checkbox"
              :model-value="isSelectedAll"
              @change="selectAll"
            />
          </th>
          <th v-if="rows.length > 0 && rows[0].id" class="cursor-pointer" @click="changeOrder('id')">
            <div class="flex justify-start items-center">
              <span>ID</span>
              <order-arrow v-if="orderBy === 'id'" :order="order" />
            </div>
          </th>
          <slot name="customColsBeforeHeaders" />
          <th
            v-for="header in parsedHeaders"
            :key="header.id"
            scope="col"
            class="cursor-pointer"
            @click="changeOrder(header.id)"
          >
            <div class="flex justify-start items-center">
              {{ header.value }}
              <order-arrow v-if="orderBy === header.id" :order="order" />
            </div>
          </th>
          <slot name="customColsAfterHeaders" />
          <th v-if="enableDefaultActions || enableCustomActions" scope="col">
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
            class="flex flex-wrap justify-end items-center sm:table-cell has-title"
          >
            <r-input
              type="checkbox"
              :model-value="isSelected(row.id)"
              @change="select(row.id, $event.target.checked)"
            />
          </td>
          <td v-if="row.id" :data-title="$t('ID')" class="has-title">
            {{ row.id }}
          </td>
          <slot :row="getUnfilteredRowById(row.id)" name="customColsBefore" />
          <td v-for="(col, idx2) in extractedRowData[idx1]" :key="idx2" :data-title="$t(idx2)" class="has-title">
            <span
              v-if="typeof col === 'boolean'"
              class="font-bold material-icons"
              :class="col ? 'text-green-600' : 'text-red-600'"
            >
              {{ col ? 'check' : 'close' }}
            </span>
            <span v-else>{{ $filters.arrayToString(col) }}</span>
          </td>
          <slot :row="getUnfilteredRowById(row.id)" name="customColsAfter" />
          <td v-if="enableDefaultActions || enableCustomActions" :data-title="$t('Actions')" class="actions">
            <div class="flex flex-wrap justify-start items-center w-max">
              <slot :row="getUnfilteredRowById(row.id)" name="customActions" />
              <navigation-item
                v-if="enableDefaultActions"
                :route-name="editRouteName"
                :params="{ id: row.id }"
                class="m-1"
                type="button"
                size="verySmall"
                icon="edit"
                label=""
              />
              <r-button
                v-if="enableDefaultActions"
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
  <div v-else class="flex flex-wrap justify-center items-center my-4">
    <spinner class="my-4 w-16 h-16 text-gray-800" />
  </div>
</template>

<script lang="ts">
import NavigationItem from '../NavigationItem.vue'
import OrderArrow from '@/components/ui/OrderArrow.vue'
import RButton from '@/components/ui/RButton.vue'
import RInput from '@/components/ui/RInput.vue'
import RSelect from '@/components/ui/RSelect.vue'
import Spinner from '@/components/ui/Spinner.vue'

import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['addSelected', 'removeSelected', 'deleteItem', 'order'],
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
    enableDefaultActions: {
      type: Boolean,
      default: false
    },
    enableCustomActions: {
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
    },
    hideAllCols: {
      type: Boolean,
      default: false
    },
    customOrderingOptions: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      currentlySelected: []
    }
  },
  computed: {
    isSelectedAll() {
      return this.rows.every((row) => this.selected.includes(row.id))
    },
    orderingOptions() {
      const options = [{ id: 'id', value: 'ID' }].concat(this.parsedHeaders)

      const customOrderingOptions = this.customOrderingOptions ? this.customOrderingOptions : []

      return [...options, ...customOrderingOptions]
    },
    parsedHeaders() {
      const relationshipHeaders = this.relationshipCols
        ? this.relationshipCols
            .map((relationship) => {
              const tableName = relationship.table_name
              return relationship.attributes.map((attr) => {
                let id = attr.label
                const attrId = attr.id
                if (tableName && attrId) {
                  id = tableName + '.' + attrId
                } else if (attrId) {
                  id = attrId
                }

                return { id: id, value: attr.label }
              })
            })
            .flat()
        : []
      return this.headers.concat(relationshipHeaders)
    },
    extractedRowData() {
      let extractedData = []

      this.rows.forEach((row) => {
        const attributes = row.attributes
          ? Object.fromEntries(
              this.hideAllCols
                ? []
                : Object.entries(row.attributes).filter(([key]) => !this.hiddenCols || !this.hiddenCols.includes(key))
            )
          : row
        const relationships = row.relationships
        let customAttributes = {}
        for (let relationship in relationships) {
          if (!this.relationshipCols) {
            continue
          }
          const relationshipCol = this.relationshipCols.filter((header) => header.relationship === relationship)
          if (relationshipCol.length !== 1) {
            continue
          }

          const headerAttributes = relationshipCol[0].attributes
          const relationshipType = relationshipCol[0].relationship_type
          let relIds = []
          if (Array.isArray(relationships[relationship].data)) {
            relIds = relationships[relationship].data.map((rel) => rel.id)
          } else {
            relIds = [relationships[relationship].data.id]
          }

          headerAttributes.forEach((attr) => {
            const attrValue = relIds.map((id) => this.getAttributeValueFromIncluded(id, relationshipType, attr.id))
            customAttributes[attr.id] = attrValue.length === 1 ? attrValue[0] : attrValue
          })
        }

        extractedData.push({ ...attributes, ...customAttributes })
      })

      return extractedData
    }
  },
  updated() {
    this.currentlySelected = this.selected
  },
  methods: {
    select(rowId, checked) {
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
    selectAll(event) {
      const checked = event.target.checked
      const rowIds = this.rows.map((row) => row.id)

      if (checked) {
        this.currentlySelected = rowIds
        this.$emit('addSelected', rowIds)
      } else {
        this.currentlySelected = []
        this.$emit('removeSelected', rowIds)
      }
    },
    deleteItem(rowId) {
      this.$emit('deleteItem', rowId)
    },
    changeOrder(orderBy) {
      this.$emit('order', {
        orderBy: orderBy,
        order: this.order === 'asc' ? 'desc' : 'asc'
      })
    },
    isSelected(rowId) {
      return this.currentlySelected.includes(rowId)
    },
    getAttributeValueFromIncluded(id, type, attribute) {
      const attr = this.included.filter((inc) => inc.type === type && inc.id === id)

      if (attr.length === 1) {
        return attr[0].attributes[attribute]
      }
    },
    getUnfilteredRowById(id) {
      const rows = this.rows.filter((row) => {
        return row.attributes && row.id === id
      })

      if (rows.length === 1) {
        return rows[0]
      }
      return {}
    }
  }
})
</script>

<style lang="postcss">
table {
  @apply w-full;
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
