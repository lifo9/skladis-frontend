<template>
  <div>
    <alert />
    <my-header />
    <main>
      <navigation
        class="hidden md:block"
        type="desktop"
        :class="isMenuExpanded ? 'w-64' : 'w-16'"
        :key="$route.fullPath"
      />
      <div class="py-2 px-4 min-h-screen" :class="isMenuExpanded ? 'md:ml-64' : 'md:ml-16'">
        <h1
          v-if="$store.getters.currentTitle"
          class="mt-4 text-3xl font-bold text-gray-900 md:text-4xl"
          :class="$store.getters.currentSubtitle ? 'mb-2' : 'mb-8'"
        >
          {{ $store.getters.currentTitle }}
        </h1>
        <h1 v-if="$store.getters.currentSubtitle" class="mb-8 text-xl font-bold text-gray-700 md:text-2xl">
          {{ $store.getters.currentSubtitle }}
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

import { defineComponent } from 'vue'
export default defineComponent({
  components: { Logout, MyHeader, Navigation, Alert },

  data() {
    return {
      isMenuExpanded: this.$store.getters.isMenuExpanded
    }
  },

  watch: {
    '$store.getters.isMenuExpanded': function () {
      this.isMenuExpanded = this.$store.getters.isMenuExpanded
    }
  }
})
</script>
