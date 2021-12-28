<template>
  <div v-if="!loading" class="overflow-auto rounded sm:shadow">
    <table>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header" scope="col">
            {{ $t(header) }}
          </th>
          <th v-if="actions" scope="col">
            {{ $t('Actions') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx1) in rows" :key="row.id ? row.id : idx1">
          <td
            v-for="(col, idx2) in extractData(row)"
            :key="idx2"
            :data-title="$t(idx2)"
          >
            {{ col }}
          </td>
          <td v-if="actions" :data-title="$t('Actions')"></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="flex flex-wrap items-center justify-center my-4">
    <spinner class="w-16 h-16 my-4 text-gray-800" />
  </div>
</template>

<script>
import Spinner from './Spinner.vue'
export default {
  components: { Spinner },
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
      type: Array,
      default: undefined
    }
  },
  methods: {
    extractData (row) {
      return row.attributes ? row.attributes : row
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
thead tr {
  @apply hidden sm:table-row;
}
th {
  @apply px-4 py-3 text-xs font-medium tracking-wider text-left uppercase;
}
tbody {
  @apply bg-white;
}
tbody tr {
  @apply flex flex-wrap sm:table-row mb-4 border-b border-gray-300;
}

td {
  @apply relative w-full px-4 sm:py-4 text-sm break-words sm:w-auto pt-8 pb-2;
}

@media (max-width: 640px) {
  td:before {
    @apply px-2 py-1 text-xs font-medium tracking-wider text-left uppercase absolute top-0 left-0 text-white bg-gray-800;
    content: attr(data-title);
  }
}
</style>
