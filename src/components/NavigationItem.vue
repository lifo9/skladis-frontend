<template>
  <li
    v-if="type === 'list'"
    @click="navigate"
    class="navigation-menu-item"
    :class="isActiveRoute ? 'active' : ''"
  >
    <div>
      <span v-if="icon" class="material-icons">{{ icon }}</span>
      &nbsp;
      <span>{{ $t(label) }}</span>
    </div>
  </li>
  <r-button
    v-else-if="type === 'button'"
    @click="navigate"
    :size="size ? size : ''"
  >
    <span v-if="icon" class="material-icons">{{ icon }}</span>
    &nbsp;
    <span>{{ label }}</span>
  </r-button>
  <p v-else-if="type === 'plain'" @click="navigate" :size="size ? size : ''">
    {{ label }}
  </p>
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
    },
    size: {
      type: String,
      default: undefined
    }
  },
  computed: {
    isActiveRoute () {
      return this.$router.currentRoute.name === this.routeName
    }
  },
  methods: {
    async navigate () {
      if (this.$router.currentRoute.name !== this.routeName) {
        const route = this.$router.resolve({
          name: this.routeName,
          params: this.params
        })
        try {
          await this.$router.push(route.href)
          this.$emit('navigated')
        } catch (error) {}
      }
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
