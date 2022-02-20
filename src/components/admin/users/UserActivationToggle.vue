<template>
  <div v-if="!isCurrentlyLoggedIn" class="m-1">
    <r-button v-if="!isActive" class="w-28" variant="success" size="verySmall" @click="handleActivation(true)">
      {{ $t('Activate') }}
    </r-button>
    <r-button v-else class="w-28" variant="danger" size="verySmall" @click="handleActivation(false)">
      {{ $t('Deactivate') }}
    </r-button>
  </div>
</template>

<script lang="ts">
import RButton from '@/components/ui/RButton.vue'
import { enableScroll, disableScroll } from '@/utils/helpers'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import { activateUser, deactivateUser } from '@/services/UsersService'

import { defineComponent } from 'vue'
import { useMainStore } from '@/stores/mainStore'
import { mapStores } from 'pinia'
export default defineComponent({
  components: { RButton },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  computed: {
    isCurrentlyLoggedIn() {
      return this.row.id === this.mainStore.currentUser.id
    },
    isActive() {
      return this.row.attributes.active === true
    },
    ...mapStores(useMainStore)
  },
  methods: {
    async handleActivation(activate) {
      disableScroll()
      const confirmation = await this.$modal(ConfirmationModal)

      if (confirmation) {
        const endpoint = activate ? activateUser : deactivateUser
        endpoint(this.row.id)
          .then(() => {
            this.row.attributes.active = activate

            this.eventBus.emit(
              'alert',
              'success',
              activate ? this.$t('User was successfully activated') : this.$t('User was successfully deactivated')
            )
          })
          .catch((error) => {
            this.eventBus.emit('alert', 'alert', error)
          })
      }
      enableScroll()

      this.$emit('change', this.row)
    }
  }
})
</script>
