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
import RSelect, { optionsFromValues } from '@/components/ui/RSelect.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: { RSelect },
  data() {
    return {
      langs: optionsFromValues(Object.keys(this.$i18n.messages))
    }
  },
  methods: {
    switchLanguage(language) {
      this.$store.commit('setAppLanguage', language)
      this.$emit('input', language)
    }
  }
})
</script>
