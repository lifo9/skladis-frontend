<template>
  <div
    class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
  >
    <div class="flex justify-between flex-1 sm:hidden">
      <a
        href="javascript:"
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        @click="prevPage"
      >
        {{ $t('Previous') }}
      </a>
      <a
        href="javascript:"
        class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        @click="nextPage"
      >
        {{ $t('Next') }}
      </a>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          {{ $t('Showing') }}
          <span class="font-medium">{{ currentRangeStart }}</span>
          {{ $t('to') }}
          <span class="font-medium">{{ currentRangeEnd }}</span>
          {{ $t('of') }}
          <span class="font-medium">{{ total }}</span>
          {{ $t('results') }}
        </p>
      </div>
      <div>
        <nav
          class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <a
            href="javascript:"
            class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
            @click="prevPage"
          >
            <span class="sr-only">{{ $t('Previous') }}</span>
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <div v-for="page in totalPages" :key="page">
            <a
              href="javascript:"
              class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border"
              :class="
                current === page
                  ? 'text-blue-600 border-blue-500 bg-blue-50'
                  : ''
              "
              @click="changePage(page)"
            >
              {{ page }}
            </a>
            <!-- <span
              v-if="totalPages > 5 && page === middle"
              class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border"
            >
              ...
            </span> -->
            <span></span>
          </div>
          <a
            href="javascript:"
            class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
            @click="nextPage"
          >
            <span class="sr-only">{{ $t('Next') }}</span>
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  computed: {
    currentRangeStart () {
      return (this.current - 1) * this.perPage + 1
    },
    currentRangeEnd () {
      const end = this.current * this.perPage
      return end < this.total ? end : this.total
    },
    totalPages () {
      return Math.ceil(this.total / this.perPage)
    },
    middle () {
      return Math.round(this.totalPages / 2)
    }
  },
  methods: {
    changePage (page) {
      this.$emit('change', page)
    },
    nextPage () {
      const next =
        this.current + 1 > this.totalPages ? this.totalPages : this.current + 1
      this.changePage(next)
    },
    prevPage () {
      const prev = this.current - 1 < 1 ? 1 : this.current - 1
      this.changePage(prev)
    }
  }
}
</script>
