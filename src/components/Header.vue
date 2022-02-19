<template>
  <div class="sticky top-0 z-40 h-16 text-white bg-gray-800 shadow-md">
    <header
      class="flex"
      :class="!this.$store.state.signedIn ? 'container mx-auto' : ''"
    >
      <navigation
        v-if="this.$store.state.signedIn"
        type="mobile"
        class="flex items-center justify-start order-1 px-4 mr-auto md:order-2 md:hidden"
      />
      <logo
        class="justify-start order-2 mx-auto md:order-1 md:w-1/4 w-max md:ml-0"
      />
      <div class="flex items-center justify-end order-3 px-4 ml-auto md:w-1/4">
        <user-menu />
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
