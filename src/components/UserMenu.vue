<template>
  <div
    class="relative rounded-full bg-white text-gray-800 w-8 h-8 cursor-pointer"
    @click="toggleMenu"
  >
    <span class="material-icons-sharp w-8 text-2xl text-center select-none"
      >person</span
    >
    <div
      class="origin-top-right absolute z-50 right-0 mt-1.5 w-48 rounded-md shadow-lg py-1 bg-white"
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
import Logout from './Logout.vue'
export default {
  components: { Logout },
  data () {
    return {
      menuHidden: true
    }
  },
  methods: {
    toggleMenu () {
      this.menuHidden = !this.menuHidden
    }
  }
}
</script>

<style lang="postcss">
.user-menu-item {
  @apply block;
  @apply px-4;
  @apply py-2;
  @apply text-gray-700;
}
.user-menu-item.hoverable {
  @apply hover:bg-gray-100;
}
</style>
