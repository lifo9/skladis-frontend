<template>
  <div>
    <navigation-back />
    <r-form class="my-14 mx-auto w-full max-w-3xl" @submit.prevent="create">
      <r-input v-model="name" :label="$t('name')" :required="true" :disabled="loading" />

      <r-button type="submit" size="full" :loading="loading" :disabled="loading">
        <span v-if="locationId">
          {{ $filters.uppercase($t('Update')) }}
        </span>
        <span v-else>
          {{ $filters.uppercase($t('Create')) }}
        </span>
      </r-button>
    </r-form>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import NavigationBack from '@/components/ui/NavigationBack.vue'
import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'
import { createLocation, getLocation, updateLocation } from '@/services/LocationService'
import { useMainStore } from '@/stores/mainStore'
export default defineComponent({
  components: { RForm, RButton, RInput, NavigationBack },
  data() {
    return {
      loading: false,
      name: ''
    }
  },
  computed: {
    roomId() {
      return this.$route.params.id
    },
    locationId() {
      return this.$route.params.location_id
    },
    ...mapStores(useMainStore)
  },
  async mounted() {
    await this.fetchData()
    await this.setTitle()
  },
  methods: {
    async create() {
      this.loading = true
      const endpoint = this.locationId ? updateLocation : createLocation
      try {
        await endpoint({
          id: this.locationId,
          name: this.name,
          roomId: this.roomId
        })
        this.eventBus.emit('alert', {
          level: 'success',
          message: this.locationId
            ? this.$t('Location was successfully updated')
            : this.$t('Location was successfully created')
        })
        if (!this.locationId) {
          this.resetForm()
        }
      } catch (error) {
        this.eventBus.emit('alert', { level: 'alert', message: error })
      }
      this.setTitle()
      this.loading = false
    },
    async fetchData() {
      this.loading = true
      if (this.locationId) {
        try {
          const location = await getLocation(this.locationId)
          const data = location.data.data.attributes
          const relationships = location.data.data.relationships
          for (let [key, value] of Object.entries(data)) {
            this[key] = value
          }
          for (let [key, relationship] of Object.entries(relationships)) {
            this[key] = Array.isArray(relationship.data)
              ? relationship.data
                  .map((rel) => {
                    return rel.id
                  })
                  .flat()
              : relationship.data.id
          }
        } catch (error) {}
      }
      this.loading = false
    },
    resetForm() {
      this.name = ''
    },
    setTitle() {
      if (this.name) {
        this.mainStore.setCurrentTitle(this.$t('location'))
        this.mainStore.setCurrentSubtitle(this.name)
      }
    }
  }
})
</script>
