<template>
  <div class="flex justify-between items-center py-3 px-4 bg-white border-t border-gray-200 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <a
        href="javascript:"
        class="inline-flex relative items-center py-2 px-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300"
        @click="prevPage"
      >
        {{ $t('Previous') }}
      </a>
      <a
        href="javascript:"
        class="inline-flex relative items-center py-2 px-4 ml-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300"
        @click="nextPage"
      >
        {{ $t('Next') }}
      </a>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:justify-between sm:items-center">
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
        <nav class="inline-flex relative z-0 -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <a
            href="javascript:"
            class="inline-flex relative items-center p-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 rounded-l-md border border-gray-300"
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
          <div v-if="totalPages < 6">
            <div v-for="page in totalPages" :key="page">
              <pagination-number :current="current" :page="page" @change="changePage" />
              <span />
            </div>
          </div>
          <div v-else>
            <pagination-number :current="current" :page="1" @change="changePage" />
            <span
              v-if="current > 3"
              class="inline-flex relative z-10 items-center py-2 px-4 text-sm font-medium text-gray-700 border"
            >
              ...
            </span>
            <pagination-number
              v-if="current === totalPages"
              :current="current"
              :page="current - 2"
              @change="changePage"
            />
            <pagination-number v-if="current > 2" :current="current" :page="current - 1" @change="changePage" />
            <pagination-number
              v-if="current != 1 && current !== totalPages"
              :current="current"
              :page="current"
              @change="changePage"
            />
            <pagination-number
              v-if="current < totalPages - 1"
              :current="current"
              :page="current + 1"
              @change="changePage"
            />
            <pagination-number v-if="current === 1" :current="current" :page="current + 2" @change="changePage" />
            <span
              v-if="current < totalPages - 2"
              class="inline-flex relative z-10 items-center py-2 px-4 text-sm font-medium text-gray-700 border"
            >
              ...
            </span>
            <pagination-number :current="current" :page="totalPages" @change="changePage" />
          </div>
          <a
            href="javascript:"
            class="inline-flex relative items-center p-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 rounded-r-md border border-gray-300"
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

<script lang="ts">
import PaginationNumber from '@/components/ui/PaginationNumber.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['change'],
  components: { PaginationNumber },
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
    currentRangeStart() {
      return (this.current - 1) * this.perPage + 1
    },
    currentRangeEnd() {
      const end = this.current * this.perPage
      return end < this.total ? end : this.total
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage)
    },
    middle() {
      return Math.round(this.totalPages / 2)
    }
  },
  methods: {
    changePage(page) {
      this.$emit('change', page)
    },
    nextPage() {
      const next = this.current + 1 > this.totalPages ? this.totalPages : this.current + 1
      this.changePage(next)
    },
    prevPage() {
      const prev = this.current - 1 < 1 ? 1 : this.current - 1
      this.changePage(prev)
    }
  }
})
</script>
