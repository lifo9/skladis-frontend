<template>
  <div class="md:border-t">
    <a
      v-if="type === 'mobile'"
      class="flex items-center justify-center w-8 h-full text-2xl text-center text-white select-none material-icons-sharp"
      href="javascript:"
      @click="toggleMenu()"
    >
      menu
    </a>
    <div
      v-if="isOpen || type === 'desktop'"
      class="absolute left-0 z-50 w-full min-h-screen px-0 bg-gray-900 md:z-auto md:fixed md:w-64 top-16"
    >
      <ul class="h-screen overflow-y-auto">
        <li
          class="navigation-menu-item"
          :class="isActiveRoute('Home') ? 'active' : ''"
        >
          <a href="javascript:" @click="navigate('Home')"
            ><span class="material-icons">home</span>&nbsp;{{ $t('Home') }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'mobile'
    }
  },

  data () {
    return {
      isOpen: false
    }
  },

  methods: {
    toggleMenu () {
      this.isOpen = !this.isOpen
    },
    navigate (routeName) {
      if (this.$router.currentRoute.name !== routeName) {
        const route = this.$router.resolve({ name: routeName })
        this.$router.push(route.href)
      }
      this.isOpen = false
    },
    isActiveRoute (routeName) {
      return this.$router.currentRoute.name === routeName
    }
  }
}
</script>

<style lang="postcss">
.navigation-menu-item {
  @apply block px-4 py-3 border-b border-gray-400 text-lg;
}
.navigation-menu-item:hover,
.navigation-menu-item.active {
  @apply bg-gray-800;
}
.navigation-menu-item > a {
  @apply flex items-center text-white;
}
.navigation-menu-item:last-of-type {
  @apply border-none;
}
</style>
