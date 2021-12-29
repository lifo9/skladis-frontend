<template>
  <li
    v-if="type === 'list'"
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
  <r-button v-else-if="type === 'button'" @click="navigate(routeName)">
    <span v-if="icon" class="material-icons">{{ icon }}</span>
    &nbsp;
    <span>{{ label }}</span>
  </r-button>
</template>

<script>
import RButton from './ui/RButton.vue'

export default {
  components: { RButton },
  props: {
    type: {
      type: String,
      default: 'list'
    },
    routeName: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default: undefined
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
