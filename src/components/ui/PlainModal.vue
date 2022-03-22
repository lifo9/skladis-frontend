<template>
  <vue-final-modal v-slot="{ close, params }" v-bind="$attrs" classes="modal-container">
    <div
      class="flex relative flex-wrap justify-center items-center p-4 m-4 min-w-[90vw] max-w-[90vw] h-[75vh] bg-white rounded-md md:p-8 md:min-w-[50vw]"
    >
      <div class="absolute top-0 right-0 z-50 p-4 md:p-8">
        <r-button size="min" variant="plain" @click="close">
          <span class="font-bold text-gray-800 material-icons">close</span>
        </r-button>
      </div>
      <div class="overflow-auto absolute p-4 w-full h-full md:p-8">
        <pre v-if="params.json">{{ params.text }}</pre>
        <span v-else>{{ params.text }}</span>
      </div>
    </div>
  </vue-final-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import RButton from '@/components/ui/RButton.vue'

export default defineComponent({
  components: { RButton }
})
</script>

<style lang="postcss" scoped>
:deep(.modal-container) {
  @apply flex justify-center items-center overflow-hidden z-50;
}
</style>
