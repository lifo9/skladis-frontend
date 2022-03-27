<template>
  <div class="grid relative items-start py-2 space-y-4 space-x-0 md:grid-cols-6 md:space-y-0 md:space-x-2">
    <div
      class="flex flex-wrap items-center w-full md:col-span-2 md:h-full stock-item__item"
      :data-title="$filters.capitalize($t('Product'))"
    >
      {{ productName }}
    </div>
    <div class="md:col-span-2 stock-item__item" :data-title="$filters.capitalize($t('Room'))">
      <multiselect
        v-model="room"
        track-by="id"
        label="label"
        :options="roomOptions"
        :searchable="true"
        :placeholder="$t('Room')"
        :select-label="$t('select')"
        :selected-label="$t('deselect')"
        :deselect-label="$t('deselect')"
        :no-options="$t('Not found')"
        :show-no-results="false"
      />
    </div>
    <div class="col-span-1 w-full stock-item__item" :data-title="$filters.capitalize($t('expiration'))">
      <r-input
        v-model="expiration"
        custom-padding="p-2"
        type="date"
        :placeholder="$t('expiration')"
        :date-config="{ minDate: new Date() }"
      />
    </div>
    <div
      class="flex flex-wrap items-center w-full md:justify-center md:h-full stock-item__item"
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
    }
  },
  emits: ['stockItemChange'],
  data() {
    return {
      product: undefined,
      expiration: undefined,
      room: undefined
    }
  },
  computed: {
    productOption() {
      return [{ id: this.productId, label: this.productName }]
    }
  },
  watch: {
    expiration() {
      this.handleExpirationChange()
    },
    room() {
      this.handleRoomChange()
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
