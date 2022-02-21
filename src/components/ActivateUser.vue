<template>
  <div class="flex flex-wrap justify-center items-center p-12">
    <r-spinner v-if="loading" class="w-32 h-32 text-gray-800" />
    <div v-else-if="activated" class="flex flex-wrap justify-center items-center w-full text-center text-green-600">
      <h1 class="pb-4 w-full text-center">
        {{ $t('Activation successful') }}
      </h1>
      <p>{{ $t('You will be redirected to the sign in page') }}</p>
      <span class="w-full text-9xl material-icons">check_circle_outline</span>
    </div>
    <div v-else class="flex flex-wrap justify-center items-center w-full">
      <h1 class="pb-4 w-full text-center text-red-600">
        {{ $t('Activation failed') }}
      </h1>
      <span class="text-9xl text-red-600 material-icons">error_outline</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import RSpinner from '@/components/ui/RSpinner.vue'
import { activate } from '@/services/UserService'
export default defineComponent({
  components: { RSpinner },
  data() {
    return {
      loading: false,
      activated: false,
      error: ''
    }
  },
  mounted() {
    this.activateUser()
  },
  methods: {
    async activateUser() {
      try {
        this.loading = true
        await activate(this.$route.params.activation_key)
        this.activated = true

        setTimeout(() => {
          this.$router.replace('/sign-in')
        }, 3000)
      } catch (error) {}
      this.loading = false
    }
  }
})
</script>
