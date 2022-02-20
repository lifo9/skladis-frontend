<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs" classes="modal-container">
    <div class="flex flex-wrap justify-center items-center p-8 m-4 max-w-xl max-h-96 bg-white rounded-md">
      <div class="flex flex-wrap justify-between w-full">
        <h2>{{ $t('Are you sure') }}?</h2>
        <r-button size="min" variant="plain" @click="close">
          <span class="font-bold text-gray-800 material-icons">close</span>
        </r-button>
      </div>
      <span class="mb-4 w-full text-9xl text-center text-red-600 material-icons">warning</span>
      <div class="flex justify-center space-x-4 align-middle">
        <r-button variant="secondary" @click="$emit('cancel', close)">
          {{ $t('Cancel') }}
        </r-button>
        <r-button variant="danger" @click="$emit('confirm', close)">
          {{ $t('OK') }}
        </r-button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script lang="ts">
import RButton from '@/components/ui/RButton.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['confirm', 'cancel'],
  components: { RButton }
})
</script>

<style lang="postcss" scoped>
:deep(.modal-container) {
  @apply flex justify-center items-center overflow-hidden z-50;
}
.modal__close {
  @apply absolute top-2 right-2;
}
</style>
