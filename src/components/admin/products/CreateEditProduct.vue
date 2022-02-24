<template>
  <div>
    <router-link class="flex items-center text-blue-600" :to="{ name: 'ProductsView' }">
      <span class="material-icons">arrow_back</span>
      {{ $t('Back') }}
    </router-link>
    <p v-if="noSuppliers" class="py-4">
      {{ $t('Please, first create a supplier') }}
    </p>
    <r-form v-else class="my-14 mx-auto w-full max-w-md" @submit.prevent="create">
      <r-input v-model="name" :label="$t('name')" :required="true" :disabled="loading" />
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
          {{ $filters.uppercase($t('Update')) }}
        </span>
        <span v-else>
          {{ $filters.uppercase($t('Create')) }}
        </span>
      </r-button>
    </r-form>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'
import Multiselect from 'vue-multiselect'

import RButton from '@/components/ui/RButton.vue'
import RForm from '@/components/ui/RForm.vue'
import RInput from '@/components/ui/RInput.vue'
import { createProdcut, getProduct, updateProduct } from '@/services/ProductService'
import { getSuppliers } from '@/services/SupplierService'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { RForm, RButton, RInput, Multiselect },
  data() {
    return {
      loading: false,
      name: '',
      supplierOptions: [],
      noSuppliers: false,
      suppliers: []
    }
  },
  computed: {
    productId() {
      return this.$route.params.id
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
          supplierIds: this.suppliers.map((supplier) => supplier.id)
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
        const suppliers = await getSuppliers({ perPage: 100 }) // TODO:jf dynamic loading when paginated
        this.supplierOptions = suppliers.data.data.map((supplier) => {
          return {
            id: supplier.id,
            label: supplier.attributes.name
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
      this.suppliers = undefined
    },
    getSupplierById(id) {
      const supplier = this.supplierOptions.filter((option) => option.id == id)
      if (supplier && supplier.length === 1) {
        return supplier[0]
      }

      return {}
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

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
