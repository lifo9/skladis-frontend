<template>
  <div class="flex items-center justify-center">
    <r-select
      class="w-full"
      :label="$t('Language')"
      :options="langs"
      :disableDefaultOption="true"
      :value="this.$i18n.locale"
      @input="switchLanguage"
    />
  </div>
</template>

<script>
import RSelect, { optionsFromValues } from './ui/RSelect.vue'
export default {
  components: { RSelect },
  data () {
    return {
      langs: optionsFromValues(Object.keys(this.$i18n.messages))
    }
  },
  methods: {
    switchLanguage (language) {
      this.$store.commit('setAppLanguage', language)
      this.$emit('input', language)
    }
  }
}
</script>
