<template>
  <div>
    <router-link
      class="flex items-center text-blue-600"
      :to="{ name: 'ContactsView' }"
    >
      <span class="material-icons">arrow_back</span>
      {{ $t('Back') }}
    </router-link>
    <r-form @submit.prevent="create" class="w-full max-w-md mx-auto my-14">
      <r-input
        v-model="first_name"
        :label="$t('first_name')"
        required="required"
        :disabled="loading"
      />
      <r-input
        v-model="last_name"
        :label="$t('last_name')"
        required="required"
        :disabled="loading"
      />
      <r-input
        v-model="email"
        :label="$t('email')"
        required="required"
        :disabled="loading"
      />
      <r-input
        v-model="phone"
        :label="$t('phone')"
        required="required"
        :disabled="loading"
      />

      <r-button
        type="submit"
        size="full"
        :loading="loading"
        :disabled="loading"
      >
        <span v-if="contactId">
          {{ $t('Update') | uppercase }}
        </span>
        <span v-else>
          {{ $t('Create') | uppercase }}
        </span>
      </r-button>
    </r-form>
  </div>
</template>

<script>
import RButton from '../../ui/RButton.vue'
import RForm from '../../ui/RForm.vue'
import RInput from '../../ui/RInput.vue'
import {
  getContact,
  createContact,
  updateContact
} from '../../../backend/services/ContactsService'

export default {
  components: { RForm, RButton, RInput },
  data () {
    return {
      loading: false,
      first_name: '',
      last_name: '',
      email: '',
      phone: ''
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {
    contactId () {
      return this.$route.params.id
    }
  },
  methods: {
    async create () {
      this.loading = true
      const endpoint = this.contactId ? updateContact : createContact
      try {
        await endpoint({
          id: this.contactId,
          firstName: this.first_name,
          lastName: this.last_name,
          email: this.email,
          phone: this.phone
        })
        this.$root.$emit(
          'alert',
          'success',
          this.contactId
            ? this.$t('Contact was successfully updated')
            : this.$t('Contact was successfully created')
        )
        if (!this.contactId) {
          this.resetForm()
        }
      } catch (error) {
        this.$root.$emit('alert', 'alert', error)
      }
      this.loading = false
    },
    async fetchData () {
      this.loading = true
      if (this.contactId) {
        try {
          const contact = await getContact(this.contactId)
          const data = contact.data.data.attributes
          for (let [key, value] of Object.entries(data)) {
            this[key] = value
          }
        } catch (error) {}
      }
      this.loading = false
    },
    resetForm () {
      this.first_name = ''
      this.last_name = ''
      this.email = ''
      this.phone = ''
    }
  }
}
</script>
