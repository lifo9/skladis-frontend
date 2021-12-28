<template>
  <modal-layout
    :title="$t('Are you sure') + '?'"
    class="w-min"
    @before-close="scrolling"
  >
    <span class="w-full mb-4 text-center text-red-600 text-9xl material-icons"
      >warning</span
    >
    <div class="flex justify-center space-x-4 align-middle">
      <r-button variant="secondary" @click="$emit('close', false)">
        {{ $t('Cancel') }}
      </r-button>
      <r-button variant="danger" @click="$emit('close', true)">
        {{ $t('OK') }}
      </r-button>
    </div>
  </modal-layout>
</template>

<script>
import RButton from './RButton.vue'
import { enableScroll } from '../../backend/utils/helpers'

export default {
  components: { RButton },
  methods: {
    scrolling (close) {
      const enable = new Promise(resolve => {
        enableScroll()
        resolve(true)
      })
      enable.then(close)
    }
  }
}
</script>

<style lang="postcss">
body.modal-open {
  overflow: hidden;
}
</style>
