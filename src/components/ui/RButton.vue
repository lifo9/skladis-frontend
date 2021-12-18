<template>
  <component
    :is="type"
    v-on="$listeners"
    class="inline-flex justify-center items-center border border-transparent text-base leading-6 font-medium rounded-md active:bg-blue-700 transition ease-in-out duration-150"
    :class="btnClass"
    :loading="loading"
    :disabled="disabled"
    :size="size"
    :href="to"
  >
    <svg
      v-if="loading"
      class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot />
  </component>
</template>

<script>
import Vue from "vue";

const sizes = ["small", "normal", "full"];
const variants = ["primary", "secondary", "danger"];

export default Vue.extend({
  props: {
    size: {
      default: "normal",
      validator: (value) => sizes.includes(value),
    },
    variant: {
      default: "primary",
      validator: (value) => variants.includes(value),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
    },
  },
  computed: {
    type() {
      if (this.to) {
        return "a";
      }
      return "button";
    },
    btnClass() {
      return {
        "cursor-not-allowed": this.disabled === true,
        "px-4 py-2 max-w-md": this.size === "small",
        "px-6 py-3 max-w-md": this.size === "normal",
        "px-6 py-3 w-full": this.size === "full",

        "text-white bg-blue-600 hover:bg-blue-500 focus:border-blue-700":
          this.variant === "primary",
        "text-white bg-gray-600 hover:bg-gray-500 focus:border-gray-700":
          this.variant === "secondary",
        "text-white bg-red-600 hover:bg-red-500 focus:border-red-700":
          this.variant === "danger",
      };
    },
  },
});
</script>
