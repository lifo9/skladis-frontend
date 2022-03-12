<template>
  <div>
    <navigation-back />
    <p v-if="noSuppliers" class="py-4">
      {{ $t('Please, first create a supplier') }}
    </p>
    <r-form v-else class="my-14 mx-auto w-full max-w-3xl" @submit.prevent="create">
      <vue-final-modal v-model="showImageUploadModal" classes="modal-container">
        <div class="flex flex-wrap justify-center items-center p-8 m-4 max-w-5xl bg-white rounded-md md:justify-start">
          <div class="flex flex-wrap justify-between pb-4 w-full">
            <h3 class="font-medium text-gray-800">{{ $t('Images') }}</h3>
            <r-button size="min" variant="plain" @click.prevent="showImageUploadModal = false">
              <span class="font-bold text-gray-800 material-icons">close</span>
            </r-button>
          </div>
          <div v-for="(image, idx) in images" :key="`image_${idx}`" class="flex flex-wrap">
            <image-upload
              :key="image != '' ? image : `image_${idx}`"
              :disabled="loading"
              @change="handleImageChange($event, idx)"
            >
              <template v-if="image" #image>
                <img v-if="image.blob" :src="image.blob" class="object-contain w-64 max-h-48 text-center" />
                <img v-else-if="image.url" :src="image.url" class="object-contain w-64 max-h-48 text-center" />
              </template>
            </image-upload>
          </div>
          <image-upload :disabled="loading" :show-image="false" class="w-full" @change="handleImageChange" />
          <r-button variant="success" class="mx-auto mt-10 w-full" @click="showImageUploadModal = false">
            {{ $t('OK') }}
          </r-button>
        </div>
      </vue-final-modal>
      <image-slider v-if="images.length > 0" :images="imageUrls" class="object-contain h-60 md:h-80" />
      <div class="flex flex-wrap justify-center items-center">
        <r-button variant="success" @click.prevent="showImageUploadModal = true">
          {{ $filters.uppercase($t('Edit images')) }}
        </r-button>
      </div>
      <r-input v-model="order_code" :label="$t('order_code')" :required="true" :disabled="loading" />
      <r-input v-model="name" :label="$t('name')" :required="true" :disabled="loading" />
      <div class="flex flex-wrap justify-between items-center">
        <div class="w-full md:w-1/2">
          <r-input v-model="barcode_type" type="hidden" />
          <r-input v-model="barcode_code" :label="$t('barcode_code')" :required="true" :disabled="loading" />
        </div>
        <div class="w-full md:w-1/2">
          <barcode-scanner class="py-2 md:pl-4 md:mt-5" @input="handleBarcodeScanner" />
        </div>
      </div>
      <r-input
        v-model="pieces_ideal"
        :label="$t('pieces_ideal')"
        :required="true"
        :disabled="loading"
        type="number"
        step="1"
        min="0"
      />
      <r-input
        v-model="pieces_critical"
        :label="$t('pieces_critical')"
        :required="true"
        :disabled="loading"
        type="number"
        step="1"
        min="0"
      />
      <multiselect
        v-model="suppliers"
        :options="supplierOptions"
        :multiple="true"
        :taggable="true"
        :searchable="true"
        :required="true"
        track-by="id"
        label="label"
        :placeholder="$t('Suppliers')"
        :tag-placeholder="$t('Suppliers')"
        :select-label="$t('select')"
        :selected-label="$t('deselect')"
        :deselect-label="$t('deselect')"
      />

      <r-button type="submit" size="full" :loading="loading" :disabled="loading || noSuppliers">
        <span v-if="productId">
          {{ $filters.uppercase($t('Update') + ' ' + $t('Product')) }}
        </span>
        <span v-else>
          {{ $filters.uppercase($t('Create') + ' ' + $t('Product')) }}
        </span>
      </r-button>
    </r-form>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'
import Multiselect from 'vue-multiselect'

import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'
import ImageSlider from '@/components/ui/ImageSlider.vue'
import ImageUpload from '@/components/ui/ImageUpload.vue'
import NavigationBack from '@/components/ui/NavigationBack.vue'
import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'
import RSelect from '@/components/ui/RSelect.vue'
import { createProdcut, getProduct, updateProduct } from '@/services/ProductService'
import { getSupplierOptions, getSuppliers } from '@/services/SupplierService'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: {
    RForm,
    RButton,
    RInput,
    Multiselect,
    ImageUpload,
    ImageSlider,
    NavigationBack,
    RSelect,
    BarcodeScanner
  },
  data() {
    return {
      loading: false,
      name: '',
      order_code: '',
      barcode_type: undefined,
      barcode_code: '',
      pieces_ideal: undefined,
      pieces_critical: undefined,
      supplierOptions: [],
      noSuppliers: false,
      suppliers: [],
      images: [],
      newImage: '',
      showImageUploadModal: false
    }
  },
  computed: {
    productId() {
      return this.$route.params.id
    },
    imageUrls() {
      return this.images.map((image) => {
        if (image.blob) {
          return image.blob
        } else if (image.url) {
          return image.url
        }
      })
    },
    ...mapStores(useMainStore)
  },
  async beforeMount() {
    await this.fetchSuppliers()
    await this.fetchData()
    await this.setTitle()
  },
  methods: {
    async create() {
      if (!this.validateInputs()) {
        return
      }

      this.loading = true
      const endpoint = this.productId ? updateProduct : createProdcut
      try {
        await endpoint({
          id: this.productId,
          name: this.name,
          orderCode: this.order_code,
          barcodeType: this.barcode_type,
          barcodeCode: this.barcode_code,
          piecesIdeal: this.pieces_ideal,
          piecesCritical: this.pieces_critical,
          supplierIds: this.suppliers.map((supplier) => supplier.id),
          images: this.images.map((image) => (image.file ? image.file : image.id))
        })
        this.eventBus.emit('alert', {
          level: 'success',
          message: this.productId
            ? this.$t('Product was successfully updated')
            : this.$t('Product was successfully created')
        })
        if (!this.productId) {
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
      if (this.productId) {
        try {
          const product = await getProduct(this.productId)
          const data = product.data.data.attributes
          const relationships = product.data.data.relationships
          for (let [key, value] of Object.entries(data)) {
            this[key] = value
          }
          this.suppliers = relationships.suppliers.data.map((supplier) => {
            const supplierObj = this.getSupplierById(supplier.id)
            if (supplierObj) {
              return {
                id: supplier.id,
                label: supplierObj.label
              }
            }
          })
        } catch (error) {}
      }
      this.loading = false
    },
    async fetchSuppliers() {
      this.loading = true
      try {
        const suppliers = await getSupplierOptions()
        this.supplierOptions = suppliers.data.map((supplier) => {
          return {
            id: supplier.id,
            label: supplier.label
          }
        })
      } catch (error) {}
      if (this.supplierOptions.length === 0) {
        this.noSuppliers = true
      }
      this.loading = false
    },
    validateInputs() {
      if (this.suppliers.length === 0) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, select suppliers') })
        return false
      }

      return true
    },
    resetForm() {
      this.name = ''
      this.order_code = ''
      this.barcode_type = undefined
      this.barcode_code = ''
      this.pieces_ideal = undefined
      this.pieces_critical = undefined
      this.suppliers = undefined
      this.images = []
      this.newImage = ''
      this.showImageUploadModal = false
    },
    getSupplierById(id) {
      const supplier = this.supplierOptions.filter((option) => option.id == id)
      if (supplier && supplier.length === 1) {
        return supplier[0]
      }

      return {}
    },
    handleImageChange(file, idx) {
      if (file) {
        if (this.images[idx]) {
          this.images[idx] = { file: file, blob: URL.createObjectURL(file) }
        } else {
          this.images.push(file)
        }
      } else {
        this.images.splice(idx, 1)
      }
    },
    handleBarcodeScanner(scan) {
      console.log(scan)
      this.barcode_type = scan.format
      this.barcode_code = scan.code
    },
    setTitle() {
      if (this.name) {
        this.mainStore.setCurrentTitle(this.$t('Products'))
        this.mainStore.setCurrentSubtitle(this.name)
      }
    }
  }
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

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
