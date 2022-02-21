<template>
  <div class="flex justify-center items-center">
    <r-select
      class="w-full"
      :label="$t('Language')"
      :options="langs"
      :disable-default-option="true"
      :value="$i18n.locale"
      @input="switchLanguage"
    />
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import RSelect, { optionsFromValues } from '@/components/ui/RSelect.vue'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { RSelect },
  data() {
    return {
      langs: optionsFromValues(this.$i18n.availableLocales)
    }
  },
  computed: {
    ...mapStores(useMainStore)
  },
  methods: {
    switchLanguage(event) {
      const language = event.target.value

      this.mainStore.setAppLanguage(language)
    }
  }
})
</script>
