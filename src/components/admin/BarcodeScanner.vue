<template>
  <div class="p-2 w-full max-w-sm">
    <div class="modal" :class="!scanning ? 'hidden' : 'flex justify-center'">
      <div id="interactive" class="viewport scanner"></div>
      <r-button variant="danger" class="z-50 w-full" @click="finishScanning">
        <span class="mr-2 material-icons">cancel</span>
        {{ $filters.uppercase($t('Cancel')) }}
      </r-button>
      <span class="grid-x"></span>
    </div>
    <div>
      <div class="flex overflow-hidden flex-wrap py-2 px-1">
        <div class="overflow-hidden w-1/4">
          <b>{{ $t('Format') }}:</b>
        </div>

        <div class="overflow-hidden w-3/4">
          {{ format }}
        </div>

        <div class="overflow-hidden w-1/4">
          <b>{{ $t('Code') }}:</b>
        </div>

        <div class="overflow-hidden w-3/4">
          {{ code }}
        </div>
      </div>
      <r-button class="w-full" @click="initializeScanner">
        <span class="mr-2 material-icons">document_scanner</span>
        {{ $filters.uppercase($t('Scan')) }}
      </r-button>
    </div>
  </div>
</template>

<script lang="ts">
// TODO - Refactor !
import Quagga from 'quagga'
import { defineComponent } from 'vue'

import RButton from '@/components/ui/RButton.vue'
export default defineComponent({
  components: { RButton },
  emits: ['input'],

  data() {
    return {
      scanning: false,
      format: undefined,
      code: undefined
    }
  },

  methods: {
    initializeScanner() {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              width: 640,
              height: 480,
              facing: 'environment'
            }
          },
          locator: {
            patchSize: 'medium',
            halfSample: true
          },
          numOfWorkers: navigator.hardwareConcurrency || 2,
          decoder: {
            readers: ['ean_reader', 'code_128_reader', 'code_39_reader'] // todo
          },
          locate: true
        },
        function (err) {
          if (err) {
            return console.log(err)
          }
          Quagga.start()
        }
      )
      Quagga.onDetected(this.finishScanning)

      this.scanning = true
      this.format = undefined
      this.code = undefined
      document.body.classList.add('modal-open')
    },
    finishScanning(result) {
      if (result.codeResult) {
        this.format = result.codeResult.format
        this.code = result.codeResult.code

        this.$emit('input', {
          format: this.format,
          code: this.code
        })
      }
      this.scanning = false
      document.body.classList.remove('modal-open')
      Quagga.stop()
    }
  }
})
</script>

<style lang="postcss">
#interactive canvas,
#interactive br {
  @apply hidden;
}
#interactive video {
  @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full;
}
.modal {
  @apply fixed inset-0 bg-black bg-opacity-80 overflow-y-auto h-full w-full items-end p-4;
}
.modal .grid-x {
  @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-red-600 opacity-40;
}
body.modal-open {
  overflow: hidden;
}
</style>
