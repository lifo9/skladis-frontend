<template>
  <div class="flex items-center justify-center">
    <select v-model="$i18n.locale" class="text-black form-select">
      <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
        {{ lang }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data () {
    return { langs: Object.keys(this.$i18n.messages) }
  }
}
</script>
