<template>
  <div class="flex flex-wrap items-center justify-center p-12">
    <svg
      v-if="loading"
      class="w-32 h-32 mr-3 -ml-1 text-gray-800 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <div
      v-else-if="activated"
      class="flex flex-wrap items-center justify-center w-full text-center text-green-600"
    >
      <h1 class="w-full pb-4 text-center">
        {{ $t('Activation successful') }}
      </h1>
      <p>{{ $t('You will be redirected to the sign in page') }}</p>
      <span class="w-full material-icons text-9xl">
        check_circle_outline
      </span>
    </div>
    <div v-else class="flex flex-wrap items-center justify-center w-full">
      <h1 class="w-full pb-4 text-center text-red-600">
        {{ $t('Activation failed') }}
      </h1>
      <span class="text-red-600 material-icons text-9xl">
        error_outline
      </span>
    </div>
  </div>
</template>

<script>
import { activate } from '../backend/services/UserService'
import Alert from './ui/Alert.vue'

export default {
  components: { Alert },
  data () {
    return {
      loading: false,
      activated: false,
      error: ''
    }
  },
  mounted () {
    this.activateUser()
  },
  methods: {
    async activateUser () {
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
}
</script>
