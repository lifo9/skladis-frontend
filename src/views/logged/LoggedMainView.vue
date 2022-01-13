<template>
  <div>
    <alert />
    <my-header />
    <main>
      <navigation
        class="hidden w-64 md:block"
        type="desktop"
        :key="$route.fullPath"
      />
      <div class="min-h-screen px-4 py-2 md:ml-64">
        <h1
          v-if="$store.state.currentTitle"
          class="mt-4 mb-8 text-4xl font-bold text-gray-900 sm:truncate"
        >
          {{ $store.state.currentTitle }}
        </h1>
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import Logout from '../../components/Logout.vue'
import MyHeader from '../../components/Header.vue'
import Navigation from '../../components/Navigation.vue'
import Alert from '../../components/ui/Alert.vue'

export default {
  components: { Logout, MyHeader, Navigation, Alert }
}
</script>
