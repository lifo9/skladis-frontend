<template>
  <div class="m-1" v-if="!isCurrentlyLoggedIn">
    <r-button
      class="w-28"
      v-if="!isActive"
      variant="success"
      size="verySmall"
      @click="handleActivation(true)"
      >{{ $t('Activate') }}</r-button
    >
    <r-button
      class="w-28"
      v-else
      variant="danger"
      size="verySmall"
      @click="handleActivation(false)"
      >{{ $t('Deactivate') }}</r-button
    >
  </div>
</template>

<script>
import RButton from './ui/RButton.vue'
import { enableScroll, disableScroll } from '../backend/utils/helpers'
import ConfirmationModal from './ui/ConfirmationModal.vue'
import { activateUser, deactivateUser } from '../backend/services/UsersService'
import { store } from '../backend/store/store'

export default {
  components: { RButton },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  computed: {
    isCurrentlyLoggedIn () {
      return this.row.id === store.state.currentUser.id
    },
    isActive () {
      return this.row.attributes.active === true
    }
  },
  methods: {
    async handleActivation (activate) {
      disableScroll()
      const confirmation = await this.$modal(ConfirmationModal)

      if (confirmation) {
        const endpoint = activate ? activateUser : deactivateUser
        endpoint(this.row.id)
          .then(() => {
            this.row.attributes.active = activate

            this.$root.$emit(
              'alert',
              'success',
              activate
                ? this.$t('User was successfully activated')
                : this.$t('User was successfully deactivated')
            )
          })
          .catch(error => {
            this.$root.$emit('alert', 'alert', error)
          })
      }
      enableScroll()

      this.$emit('change', this.row)
    }
  }
}
</script>
