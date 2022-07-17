<template>
  <div class="relative grid items-start space-y-4 space-x-0 py-2 md:grid-cols-8 md:space-y-0 md:space-x-2">
    <div
      class="stock-item__item flex w-full flex-wrap items-center md:col-span-2 md:h-full"
      :data-title="$filters.capitalize($t('Product'))"
    >
      {{ productName }}
    </div>
    <div class="stock-item__item md:col-span-2" :data-title="$filters.capitalize($t('Room'))">
      <multiselect
        v-model="room"
        track-by="id"
        label="label"
        :options="filteredRoomOptions"
        :searchable="true"
        :placeholder="$t('Room')"
        :select-label="$t('select')"
        :selected-label="$t('deselect')"
        :deselect-label="$t('deselect')"
        :no-options="$t('Not found')"
        :show-no-results="false"
      />
    </div>
    <div class="stock-item__item md:col-span-2" :data-title="$filters.capitalize($t('location'))">
      <multiselect
        v-model="location"
        track-by="id"
        label="label"
        :options="filteredLocationOptions"
        :searchable="true"
        :placeholder="$t('location')"
        :select-label="$t('select')"
        :selected-label="$t('deselect')"
        :deselect-label="$t('deselect')"
        :no-options="$t('Not found')"
        :show-no-results="false"
      />
    </div>
    <div class="stock-item__item col-span-1 w-full" :data-title="$filters.capitalize($t('expiration'))">
      <r-input
        v-model="expiration"
        custom-padding="p-2"
        type="date"
        :placeholder="$t('expiration')"
        :date-config="{ minDate: new Date() }"
      />
    </div>
    <div
      class="stock-item__item flex w-full flex-wrap items-center md:h-full md:justify-center"
      :data-title="$filters.capitalize($t('quantity'))"
    >
      {{ quantity }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Multiselect from 'vue-multiselect'

import RInput from '@/components/ui/RInput.vue'

export default defineComponent({
  components: { Multiselect, RInput },
  props: {
    invoiceItemId: {
      type: Number,
      required: true
    },
    productId: {
      type: Number,
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    roomOptions: {
      type: Array,
      required: true
    },
    locationOptions: {
      type: Array,
      required: true
    }
  },
  emits: ['stockItemChange'],
  data() {
    return {
      product: undefined,
      expiration: undefined,
      room: undefined,
      location: undefined
    }
  },
  computed: {
    productOption() {
      return [{ id: this.productId, label: this.productName }]
    },
    filteredRoomOptions() {
      const rooms = this.roomOptions
      const selectedLocation = this.location
      if (selectedLocation) {
        const filteredRooms = rooms.filter((room) => room.location_ids.includes(selectedLocation.id))
        if (filteredRooms.length === 1) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.room = filteredRooms[0]
        }
        return filteredRooms
      } else {
        return rooms
      }
    },
    filteredLocationOptions() {
      const locations = this.locationOptions
      const selectedRoom = this.room
      if (selectedRoom) {
        const filteredLocations = locations.filter((location) => selectedRoom.location_ids.includes(location.id))
        if (filteredLocations.length === 1) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.location = filteredLocations[0]
        }
        return filteredLocations
      } else {
        return locations
      }
    }
  },
  watch: {
    expiration() {
      this.handleExpirationChange()
    },
    room() {
      this.handleRoomChange()
    },
    location() {
      this.handleLocationChange()
    }
  },
  methods: {
    handleExpirationChange() {
      this.$emit('stockItemChange', {
        id: this.invoiceItemId,
        expiration: this.expiration === '' ? undefined : this.expiration
      })
    },
    handleRoomChange() {
      this.$emit('stockItemChange', { id: this.invoiceItemId, room_id: this.room?.id })
    },
    handleLocationChange() {
      this.$emit('stockItemChange', { id: this.invoiceItemId, location_id: this.location?.id })
    }
  }
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style lang="postcss" scoped>
@media (max-width: 768px) {
  .stock-item__item {
    @apply relative pt-7;
  }
  .stock-item__item:before {
    @apply px-2 py-1 text-xs font-medium tracking-wider text-left uppercase absolute top-0 left-0 text-white bg-gray-800;
    content: attr(data-title);
  }
}
</style>
