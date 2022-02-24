<template>
  <div :key="appLanguage">
    <main-alert />
    <my-header />
    <main>
      <main-navigation
        :key="$route.fullPath"
        class="hidden md:block"
        type="desktop"
        :class="isMenuExpanded ? 'w-64' : 'w-16'"
      />
      <div class="py-2 px-4 min-h-screen" :class="isMenuExpanded ? 'md:ml-64' : 'md:ml-16'">
        <h1
          v-if="currentTitle"
          class="mt-4 text-3xl font-bold text-gray-900 md:text-4xl"
          :class="currentSubtitle ? 'mb-2' : 'mb-8'"
        >
          {{ currentTitle }}
        </h1>
        <h1 v-if="currentSubtitle" class="mb-8 text-xl font-bold text-gray-700 md:text-2xl">
          {{ currentSubtitle }}
        </h1>
        <router-view />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { defineComponent } from 'vue'

import MainNavigation from '@/components/MainNavigation.vue'
import MyHeader from '@/components/MyHeader.vue'
import MainAlert from '@/components/ui/MainAlert.vue'
import { useMainStore } from '@/stores/mainStore'

export default defineComponent({
  components: { MainNavigation, MyHeader, MainAlert },

  computed: {
    ...mapState(useMainStore, ['appLanguage', 'isMenuExpanded', 'currentTitle', 'currentSubtitle'])
  }
})
</script>
