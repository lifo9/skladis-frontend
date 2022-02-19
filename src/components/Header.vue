<template>
  <div class="sticky top-0 z-40 h-16 text-white bg-gray-800 shadow-md">
    <header class="flex" :class="!this.$store.getters.signedIn ? 'container mx-auto' : ''">
      <navigation
        v-if="this.$store.getters.signedIn"
        type="mobile"
        class="flex order-1 justify-start items-center px-4 mr-auto md:hidden md:order-2"
      />
      <logo class="order-2 justify-start mx-auto w-max md:order-1 md:ml-0 md:w-1/4" />
      <div class="flex order-3 justify-end items-center px-4 ml-auto md:w-1/4">
        <user-menu />
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import Navigation from '@/components/Navigation.vue'
import Logo from '@/components/ui/Logo.vue'
import UserMenu from '@/components/UserMenu.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: { Logo, UserMenu, Navigation }
})
</script>
