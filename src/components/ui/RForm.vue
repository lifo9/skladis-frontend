<template>
  <div class="flex flex-col w-full p-2 space-y-6">
    <div
      v-if="error"
      class="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded-md"
      role="alert"
    >
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <form class="space-y-6" v-on="$listeners">
      <slot />
    </form>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: String,
      default: "",
    },
  },
};
</script>
