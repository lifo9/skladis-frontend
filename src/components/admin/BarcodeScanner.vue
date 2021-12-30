<template>
  <div class="w-full max-w-sm p-2">
    <div class="modal" :class="!scanning ? 'hidden' : 'flex justify-center'">
      <div id="interactive" class="viewport scanner"></div>
      <r-button variant="danger" class="z-50 w-full" @click="finishScanning">
        <span class="mr-2 material-icons">cancel</span
        >{{ $t('Cancel') | uppercase }}
      </r-button>
      <span class="grid-x"></span>
    </div>
    <div>
      <div class="flex flex-wrap px-1 py-2 overflow-hidden">
        <div class="w-1/4 overflow-hidden">
          <b>{{ $t('Format') }}:</b>
        </div>

        <div class="w-3/4 overflow-hidden">
          {{ format }}
        </div>

        <div class="w-1/4 overflow-hidden">
          <b>{{ $t('Code') }}:</b>
        </div>

        <div class="w-3/4 overflow-hidden">
          {{ code }}
        </div>
      </div>
      <r-button class="w-full" @click="initializeScanner">
        <span class="mr-2 material-icons">document_scanner</span
        >{{ $t('Scan') | uppercase }}
      </r-button>
    </div>
  </div>
</template>

<script>
// TODO - Refactor !
import Quagga from 'quagga'
import RButton from '../ui/RButton.vue'

export default {
  components: { RButton },

  data () {
    return {
      scanning: false,
      format: undefined,
      code: undefined
    }
  },

  methods: {
    initializeScanner () {
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
    finishScanning (result) {
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
}
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
