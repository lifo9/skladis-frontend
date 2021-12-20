<template>
  <div class="w-full p-2 text-center">
    <div class="modal" :class="!scanning ? 'hidden' : 'flex justify-center'">
      <div id="interactive" class="viewport scanner"></div>
      <r-button variant="danger" class="z-50 w-full" @click="finishScanning">
        <span class="mr-2 material-icons">cancel</span
        >{{ $t('Cancel') | uppercase }}
      </r-button>
      <span class="grid-x"></span>
    </div>
    <r-button class="w-full" @click="initializeScanner">
      <span class="mr-2 material-icons">document_scanner</span
      >{{ $t('Scan') | uppercase }}
    </r-button>
  </div>
</template>

<script>
import Quagga from 'quagga'
import RButton from '../ui/RButton.vue'

export default {
  components: { RButton },

  data () {
    return {
      scanning: false
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
      document.body.classList.add('modal-open')
    },
    finishScanning (result) {
      if (result.codeResult) {
        this.$emit('input', {
          format: result.codeResult.format,
          code: result.codeResult.code
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
