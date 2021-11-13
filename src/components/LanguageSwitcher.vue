<template>
  <div class="flex justify-center items-center">
    <select v-model="$i18n.locale" class="form-select text-black">
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
