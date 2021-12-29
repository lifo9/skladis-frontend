<template>
  <div>
    <router-link
      class="flex items-center text-blue-600"
      :to="{ name: 'ContactsView' }"
    >
      <span class="material-icons">arrow_back</span>
      {{ $t('Back') }}
    </router-link>
    <r-form
      @submit.prevent="create"
      :error="error"
      class="w-full max-w-md mx-auto my-14"
    >
      <r-input
        v-model="firstName"
        :label="$t('first_name')"
        required="required"
      />
      <r-input
        v-model="lastName"
        :label="$t('last_name')"
        required="required"
      />
      <r-input v-model="email" :label="$t('email')" required="required" />
      <r-input v-model="phone" :label="$t('phone')" required="required" />

      <r-button type="submit" size="full" :loading="loading" :disabled="loading"
        >{{ $t('Create').toUpperCase() }}
      </r-button>
    </r-form>
  </div>
</template>

<script>
// first, last, email, phone
import RButton from '../../ui/RButton.vue'
import RForm from '../../ui/RForm.vue'
import RInput from '../../ui/RInput.vue'
import { createContact } from '../../../backend/services/ContactsService'

export default {
  components: { RForm, RButton, RInput },
  data () {
    return {
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  },
  methods: {
    async create () {
      this.loading = true
      try {
        await createContact(
          this.firstName,
          this.lastName,
          this.email,
          this.phone
        )
        this.$root.$emit(
          'alert',
          'success',
          this.$t('Contact was successfully created')
        )
        this.resetForm()
      } catch (error) {
        this.$root.$emit('alert', 'alert', error)
      }
      this.loading = false
    },
    resetForm () {
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.phone = ''
    }
  }
}
</script>
