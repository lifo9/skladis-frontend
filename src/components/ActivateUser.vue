<template>
  <div class="flex flex-wrap items-center justify-center p-12">
    <spinner v-if="loading" class="w-32 h-32 text-gray-800" />
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
import Spinner from './ui/Spinner.vue'

export default {
  components: { Alert, Spinner },
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
