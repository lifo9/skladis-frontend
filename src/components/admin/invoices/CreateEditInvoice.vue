<template>
  <div>
    <navigation-back />
    <div class="mx-auto my-14 w-full max-w-5xl space-y-6">
      <r-button class="mb-5" size="full" :loading="loading" :disabled="loading" @click="createUpdate">
        <span v-if="invoiceId">
          {{ $filters.uppercase($t('Update')) }}
        </span>
        <span v-else>
          {{ $filters.uppercase($t('Create')) }}
        </span>
      </r-button>
      <div class="grid space-y-6 md:grid-cols-2 md:space-x-4 md:space-y-0">
        <r-input
          v-model="invoice_code"
          :label="$t('Invoice code')"
          label-style="text-lg mb-1"
          :required="true"
          :disabled="loading"
        />
        <r-input
          v-model="invoice_date"
          :label="$t('Invoice date')"
          label-style="text-lg mb-1"
          type="date"
          :required="true"
          :disabled="loading"
        />
      </div>
      <file-upload
        :key="fileKey"
        :disabled="loading"
        :label="$t('Attachment')"
        label-style="text-lg mb-1"
        accept-formats=""
        file-type="document"
        @change="handleAttachmentChange"
      >
        <template v-if="invoice_file" #file>
          <div class="flex flex-wrap items-center justify-center space-x-4 p-4">
            <span class="material-icons">insert_drive_file</span>
            <a :href="invoice_file" target="_blank" class="hover:underline">{{ invoice_code }}</a>
          </div>
        </template>
      </file-upload>
      <div>
        <span class="text-lg font-semibold">{{ $t('Invoice items') }}</span>
        <div
          class="relative mt-2 hidden items-start space-y-2 border-b pb-2 text-sm font-semibold md:grid md:grid-cols-7 md:space-x-2 md:space-y-0"
        >
          <div class="col-span-2">{{ $filters.uppercase($t('Product')) }}</div>
          <div class="col-span-2">{{ $filters.uppercase($t('Supplier')) }}</div>
          <div class="text-center">{{ $filters.uppercase($t('quantity')) }}</div>
          <div class="text-center">{{ $filters.uppercase($t('unit_price')) }}</div>
        </div>
        <invoice-item
          v-for="(invoiceItem, idx) in invoiceItems"
          :key="JSON.stringify(invoiceItem)"
          class="py-2"
          :class="idx < invoiceItems.length - 1 ? 'border-b' : ''"
          :initial-product="invoiceItem.product_id"
          :initial-supplier="invoiceItem.supplier_id"
          :initial-quantity="parseInt(invoiceItem.quantity)"
          :initial-unit-price="invoiceItem.unit_price"
          :product-options="productOptions"
          :supplier-options="supplierOptions"
          :added="true"
          @remove-invoice-item="handleRemoveInvoiceItem(idx)"
        />
        <div class="my-4 hidden h-[1px] w-full bg-gray-300 md:block"></div>
        <invoice-item
          v-if="productOptions && supplierOptions"
          :key="JSON.stringify(invoiceItems)"
          class="py-2 md:p-0"
          :product-options="productOptions"
          :supplier-options="supplierOptions"
          :initial-supplier="lastSupplier"
          @add-invoice-item="handleAddInvoiceItem"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import InvoiceItem from '@/components/admin/invoices/InvoiceItem.vue'
import FileUpload from '@/components/ui/FileUpload.vue'
import NavigationBack from '@/components/ui/NavigationBack.vue'
import RButton from '@/components/ui/RButton.vue'
import RInput from '@/components/ui/RInput.vue'
import {
  createInvoice,
  createInvoiceItem,
  deleteInvoiceAttachment,
  getInvoice,
  updateInvoice
} from '@/services/InvoiceService'
import { getProductOptions } from '@/services/ProductService'
import { getSupplierOptions } from '@/services/SupplierService'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { InvoiceItem, RInput, FileUpload, RButton, NavigationBack },
  data() {
    return {
      invoice_code: undefined,
      invoice_date: undefined,
      invoiceItems: [],
      invoice_file: undefined,
      attachmentFile: undefined,
      productOptions: undefined,
      supplierOptions: undefined,
      deleteAttachment: false,
      loading: false
    }
  },
  computed: {
    invoiceId() {
      return this.$route.params.id
    },
    invoiceItemsApi() {
      return undefined
    },
    fileKey() {
      if (this.invoice_file) {
        return this.invoice_file
      } else {
        return undefined
      }
    },
    lastSupplier() {
      if (this.invoiceItems && this.invoiceItems.length > 0) {
        return this.invoiceItems[this.invoiceItems.length - 1]['supplier_id']
      }

      return undefined
    },
    ...mapStores(useMainStore)
  },
  beforeMount() {
    this.fetchProductOptions()
    this.fetchSupplierOptions()
  },
  async mounted() {
    await this.fetchData()
    await this.setTitle()
  },
  methods: {
    handleAddInvoiceItem(item) {
      this.invoiceItems.push(item)
    },
    handleRemoveInvoiceItem(idx) {
      this.invoiceItems.splice(idx, 1)
    },
    handleAttachmentChange(file) {
      if (!file) {
        this.deleteAttachment = true
        this.attachmentFile = undefined
      } else {
        this.deleteAttachment = false
        this.attachmentFile = file
      }
    },
    async createUpdate() {
      if (!this.validate()) {
        return
      }

      this.loading = true
      const endpoint = this.invoiceId ? updateInvoice : createInvoice
      try {
        const invoice = await endpoint({
          id: this.invoiceId,
          invoiceCode: this.invoice_code,
          invoiceDate: this.invoice_date,
          invoiceFile: this.attachmentFile,
          invoiceItems: this.invoiceItemsApi
        })
        this.eventBus.emit('alert', {
          level: 'success',
          message: this.invoiceId
            ? this.$t('Invoice was successfully updated')
            : this.$t('Invoice was successfully created')
        })

        if (invoice.data && invoice.data.data && invoice.data.data.id && this.invoiceItems.length > 0) {
          Promise.all(
            this.invoiceItems.map((item) => {
              createInvoiceItem({
                invoice_id: invoice.data.data.id,
                ...item
              })
            })
          )
            .then((results) => {
              // pass
            })
            .catch((error) => {
              this.eventBus.emit('alert', { level: 'alert', message: error })
            })
        }

        if (invoice.data && invoice.data.data && invoice.data.data.id && this.deleteAttachment) {
          await deleteInvoiceAttachment(invoice.data.data.id)
        }

        if (!this.invoiceId) {
          this.resetForm()
        }
      } catch (error) {
        this.eventBus.emit('alert', { level: 'alert', message: error })
      }
      this.setTitle()

      this.loading = false
    },
    validate() {
      if (!this.invoice_code) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, fill the invoice code') })
        return false
      }
      if (!this.invoice_date) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, fill the invoice date') })
        return false
      }
      if (this.invoiceItems.length === 0) {
        this.eventBus.emit('alert', { level: 'alert', message: this.$t('Please, add invoice items') })
        return false
      }
      return true
    },
    resetForm() {
      this.invoice_code = undefined
      this.invoice_date = undefined
      this.invoiceItems = []
      this.invoice_file = undefined
      this.attachmentFile = undefined
      this.deleteAttachment = false
    },
    async fetchData() {
      this.loading = true

      if (this.invoiceId) {
        try {
          const product = await getInvoice(this.invoiceId)
          const data = product.data.data.attributes
          const items = product.data.included

          for (let [key, value] of Object.entries(data)) {
            this[key] = value
          }

          this.invoiceItems = items.map((item) => {
            const productId = parseInt(item.relationships['product'].data.id)
            const supplierId = parseInt(item.relationships['supplier'].data.id)
            const quantity = item.attributes.quantity
            const unitPrice = item.attributes.unit_price

            return {
              product_id: productId,
              supplier_id: supplierId,
              quantity: quantity,
              unit_price: unitPrice
            }
          })
        } catch (error) {}
      }

      this.loading = false
    },
    async fetchProductOptions() {
      this.productOptions = await this.findAsync(getProductOptions)
    },
    async fetchSupplierOptions() {
      this.supplierOptions = await this.findAsync(getSupplierOptions)
    },
    async findAsync(findMethod) {
      this.loading = true
      try {
        const data = await findMethod()
        this.loading = false
        if (data.data) {
          return data.data
        }
      } catch (error) {
        // pass
      }

      this.loading = false
      return undefined
    },
    setTitle() {
      if (this.invoice_code) {
        this.mainStore.setCurrentTitle(this.$t('Receipt of goods'))
        this.mainStore.setCurrentSubtitle(this.invoice_code)
      }
    }
  }
})
</script>
