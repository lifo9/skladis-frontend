<template>
  <div class="relative text-gray-800">
    <form @submit.prevent="search">
      <input
        v-model="searchQuery"
        class="block py-3 px-5 w-full h-10 text-base text-gray-900 placeholder:text-gray-400 bg-gray-50 rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none transition duration-500 ease-in-out"
        type="search"
        name="search"
        :placeholder="$t('Search')"
      />
      <button type="submit" class="absolute top-1/2 right-0 mr-4 -translate-y-1/2">
        <svg
          class="w-4 h-4 text-gray-700 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 56.966 56.966"
          style="enable-background: new 0 0 56.966 56.966"
          xml:space="preserve"
          width="512px"
          height="512px"
        >
          <path
            d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
          />
        </svg>
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['search'],
  data() {
    return {
      searchQuery: ''
    }
  },
  watch: {
    '$route.query': {
      handler() {
        this.setSearchFromQueryParams()
      },
      deep: true
    }
  },
  mounted() {
    this.setSearchFromQueryParams()
  },
  methods: {
    search() {
      let query = { ...this.$route.query }
      if (this.searchQuery && this.searchQuery !== '') {
        query['search'] = this.searchQuery
      } else {
        delete query['search']
      }

      this.$router.push({ path: this.$route.path, query: query })
      this.$emit('search', this.searchQuery)
    },
    setSearchFromQueryParams() {
      const query = this.$route.query['search']
      if (query) {
        this.searchQuery = query
      }
    }
  }
})
</script>
