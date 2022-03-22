<template>
  <div :class="variant === 'default' ? 'w-full' : ''">
    <div class="modal" :class="!scanning ? 'hidden' : 'flex justify-center'">
      <div id="interactive" class="viewport scanner"></div>
      <div class="flex z-[99999] flex-wrap justify-center items-center space-y-4 w-full md:space-y-0 md:space-x-4">
        <div v-if="code" class="w-full">
          <div class="py-6 my-6 mx-auto w-40 font-mono text-lg font-bold text-center bg-white rounded-md shadow-md">
            {{ code }}
          </div>
        </div>
        <r-button variant="danger" class="z-50 order-2 w-full md:order-1" @click.prevent="cancelScanning">
          <span class="mr-2 material-icons">cancel</span>
          {{ $filters.uppercase($t('Cancel')) }}
        </r-button>
        <r-button variant="success" class="z-50 order-1 w-full md:order-2" @click.prevent="finishScanning">
          <span class="mr-2 material-icons">check_circle</span>
          {{ $filters.uppercase($t('Confirm')) }}
        </r-button>
      </div>
    </div>
    <div class="flex flex-wrap justify-center items-center">
      <r-button
        v-if="variant === 'compact'"
        size="verySmall"
        variant="success"
        v-bind="$attrs"
        @click.prevent="initializeScanner"
      >
        <span class="material-icons">document_scanner</span>
        <slot />
      </r-button>
      <r-button v-else size="full" @click.prevent="initializeScanner">
        <span class="mr-2 material-icons">document_scanner</span>
        {{ $filters.uppercase($t('Scan')) }}
      </r-button>
    </div>
  </div>
</template>

<script lang="ts">
import Quagga from 'quagga'
import { defineComponent } from 'vue'

import RButton from '@/components/ui/RButton.vue'
export default defineComponent({
  components: { RButton },
  props: {
    variant: {
      type: String,
      default: 'default'
    }
  },
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
            halfSample: true,
            debug: {
              showCanvas: true,
              showPatches: false,
              showFoundPatches: false,
              showSkeleton: false,
              showLabels: false,
              showPatchLabels: false,
              showRemainingPatchLabels: false,
              boxFromPatches: {
                showTransformed: false,
                showTransformedBox: false,
                showBB: false
              }
            }
          },
          frequency: 10,
          numOfWorkers: navigator.hardwareConcurrency || 2,
          decoder: {
            readers: ['ean_reader', 'code_128_reader', 'code_39_reader'] // TODO: choose used readers
          },
          locate: true
        },
        function (err) {
          if (err) {
            // pass
          }
          Quagga.start()
        }
      )
      Quagga.onProcessed(function (result) {
        let drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              parseInt(drawingCanvas.getAttribute('width')),
              parseInt(drawingCanvas.getAttribute('height'))
            )
            result.boxes.filter(function (box) {
              return box !== result.box
            })
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 })
          }
        }
      })
      Quagga.onDetected(this.parseResult)

      this.scanning = true
      this.format = undefined
      this.code = undefined
      document.body.classList.add('modal-open')
    },
    parseResult(result) {
      if (result.codeResult) {
        this.format = result.codeResult.format
        this.code = result.codeResult.code
      }
    },
    finishScanning() {
      this.$emit('input', {
        format: this.format,
        code: this.code
      })

      this.cancelScanning()
    },
    cancelScanning() {
      this.scanning = false
      document.body.classList.remove('modal-open')
      Quagga.stop()
    }
  }
})
</script>

<style lang="postcss">
#interactive br {
  @apply hidden;
}
#interactive video,
#interactive canvas {
  @apply absolute top-0 left-1/2 transform -translate-x-1/2  w-full max-h-screen;
}
.modal {
  z-index: 99999;
  @apply fixed inset-0 bg-black bg-opacity-80 overflow-y-auto h-full w-full items-end p-4;
}
body.modal-open {
  overflow: hidden;
}
</style>
