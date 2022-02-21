<template>
  <div class="sticky top-0 z-40 h-16 text-white bg-gray-800 shadow-md">
    <header class="flex" :class="!mainStore.signedIn ? 'container mx-auto' : ''">
      <main-navigation
        v-if="mainStore.signedIn"
        type="mobile"
        class="flex order-1 justify-start items-center px-4 mr-auto md:hidden md:order-2"
      />
      <app-logo class="order-2 justify-start mx-auto w-max md:order-1 md:ml-0 md:w-1/4" />
      <div class="flex order-3 justify-end items-center px-4 ml-auto md:w-1/4">
        <user-menu />
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import MainNavigation from '@/components/MainNavigation.vue'
import AppLogo from '@/components/ui/AppLogo.vue'
import UserMenu from '@/components/UserMenu.vue'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { UserMenu, MainNavigation, AppLogo },
  computed: {
    ...mapStores(useMainStore)
  }
})
</script>
