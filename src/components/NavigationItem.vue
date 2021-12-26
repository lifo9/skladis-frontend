<template>
  <li
    @click="navigate(routeName)"
    class="navigation-menu-item"
    :class="isActiveRoute(routeName) ? 'active' : ''"
  >
    <div>
      <span v-if="icon" class="material-icons">{{ icon }}</span>
      &nbsp;
      <span>{{ $t(label) }}</span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    routeName: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    }
  },
  methods: {
    navigate (routeName) {
      if (this.$router.currentRoute.name !== routeName) {
        const route = this.$router.resolve({ name: routeName })
        this.$router.push(route.href)
      }
      this.$emit('navigated')
    },
    isActiveRoute (routeName) {
      return this.$router.currentRoute.name === routeName
    }
  }
}
</script>

<style lang="postcss">
.navigation-menu-item {
  @apply block px-4 py-3 border-b border-gray-400 text-lg cursor-pointer;
}
.navigation-menu-item:hover,
.navigation-menu-item.active {
  @apply bg-gray-800;
}
.navigation-menu-item > div {
  @apply flex items-center text-white;
}
.navigation-menu-item:last-of-type {
  @apply border-none;
}
</style>
