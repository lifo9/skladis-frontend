<template>
  <div :key="mainStore.appLanguage">
    <alert />
    <my-header />
    <main>
      <navigation
        class="hidden md:block"
        type="desktop"
        :class="mainStore.isMenuExpanded ? 'w-64' : 'w-16'"
        :key="$route.fullPath"
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
import Logout from '../../components/Logout.vue'
import MyHeader from '../../components/Header.vue'
import Navigation from '../../components/Navigation.vue'
import Alert from '@/components/ui/Alert.vue'
import { mapStores } from 'pinia'
import { useMainStore } from '@/stores/mainStore'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { Logout, MyHeader, Navigation, Alert },

  computed: {
    ...mapStores(useMainStore)
  }
})
</script>
