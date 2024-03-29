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
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import RButton from '@/components/ui/RButton.vue'
import { activateUser, deactivateUser } from '@/services/UsersService'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { RButton },
  props: {
    row: {
      type: Object,
      required: true
    },
    included: {
      type: Array,
      default: undefined
    }
  },
  emits: ['change'],
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
    handleActivation(activate) {
      this.$vfm.show({
        component: 'ConfirmationModal',
        on: {
          'confirm': (close) => {
            const endpoint = activate ? activateUser : deactivateUser
            endpoint(this.row.id)
              .then(() => {
                // eslint-disable-next-line vue/no-mutating-props
                this.row.attributes.active = activate
                this.eventBus.emit('alert', {
                  level: 'success',
                  message: activate
                    ? this.$t('User was successfully activated')
                    : this.$t('User was successfully deactivated')
                })
              })
              .catch((error) => {
                this.eventBus.emit('alert', { level: 'alert', message: error })
              })
            this.$emit('change', this.row)
            close()
          },
          cancel(close) {
            close()
          }
        }
      })
    }
  }
})
</script>
