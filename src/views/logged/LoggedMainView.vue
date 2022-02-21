<template>
  <div :key="mainStore.appLanguage">
    <main-alert />
    <my-header />
    <main>
      <main-navigation
        :key="$route.fullPath"
        class="hidden md:block"
        type="desktop"
        :class="mainStore.isMenuExpanded ? 'w-64' : 'w-16'"
      />
      <div class="py-2 px-4 min-h-screen" :class="mainStore.isMenuExpanded ? 'md:ml-64' : 'md:ml-16'">
        <h1
          v-if="mainStore.currentTitle"
          class="mt-4 text-3xl font-bold text-gray-900 md:text-4xl"
          :class="mainStore.currentSubtitle ? 'mb-2' : 'mb-8'"
        >
          {{ mainStore.currentTitle }}
        </h1>
        <h1 v-if="mainStore.currentSubtitle" class="mb-8 text-xl font-bold text-gray-700 md:text-2xl">
          {{ mainStore.currentSubtitle }}
        </h1>
        <router-view />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import MainNavigation from '@/components/MainNavigation.vue'
import MyHeader from '@/components/MyHeader.vue'
import MainAlert from '@/components/ui/MainAlert.vue'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { MainNavigation, MyHeader, MainAlert },

  computed: {
    ...mapStores(useMainStore)
  }
})
</script>
