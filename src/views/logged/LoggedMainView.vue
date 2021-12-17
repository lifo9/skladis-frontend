<template>
  <div>
    <my-header />
    <main>
      <navigation
        class="hidden w-64 md:block"
        type="desktop"
        :key="$route.fullPath"
      />
      <router-view class="min-h-screen md:ml-64" />
    </main>
  </div>
</template>

<script>
import Logout from '../../components/Logout.vue'
import MyHeader from '../../components/Header.vue'
import Navigation from '../../components/Navigation.vue'

export default {
  components: { Logout, MyHeader, Navigation }
}
</script>
