<template>
  <div class="sticky top-0 z-40 bg-gray-800 text-white">
    <header class="container mx-auto flex">
      <navigation
        class="order-1 sm:order-2 flex items-center justify-center px-4"
      />
      <logo class="order-2 sm:order-1 ml-auto sm:ml-0" />
      <div class="order-3 flex items-center justify-center px-4 ml-auto">
        <user-menu v-if="this.$store.state.signedIn" />
      </div>
    </header>
  </div>
</template>

<script>
import Navigation from './Navigation.vue'
import Logo from './ui/Logo.vue'
import UserMenu from './UserMenu.vue'
export default {
  components: { Logo, UserMenu, Navigation }
}
</script>
