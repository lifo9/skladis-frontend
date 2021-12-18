<template>
  <div
    class="relative flex text-gray-800 bg-white rounded-full cursor-pointer"
    @click="toggleMenu"
  >
    <span
      class="flex items-center justify-center w-8 text-xl text-center select-none"
      ><i class="fas fa-user"></i
    ></span>
    <span class="w-8 text-2xl text-center rounded-full select-none hoverable"
      ><i class="fas fa-caret-down"></i
    ></span>
    <div
      class="absolute z-50 right-0 mt-1.5 w-48 top-full rounded-md shadow-lg py-1 bg-white"
      :class="[menuHidden ? 'hidden' : '']"
    >
      <ul>
        <li class="user-menu-item">
          {{ this.$store.state.currentUser.email }}
        </li>
        <li><logout class="user-menu-item hoverable" /></li>
      </ul>
    </div>
  </div>
</template>

<script>
import Logout from "./Logout.vue";
export default {
  components: { Logout },
  data() {
    return {
      menuHidden: true,
    };
  },
  methods: {
    toggleMenu() {
      this.menuHidden = !this.menuHidden;
    },
  },
};
</script>

<style lang="postcss">
.user-menu-item {
  @apply block px-4 py-2 text-gray-700;
}
.hoverable {
  @apply hover:bg-gray-200;
}
</style>
