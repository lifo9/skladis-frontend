<template>
  <li
    v-if="type === 'list'"
    class="navigation-menu-item"
    :class="{ isActiveRoute: 'active', isMenuExpanded: 'justify-center' }"
    @click="navigate"
  >
    <div class="flex flex-wrap space-x-2">
      <span v-if="icon" class="material-icons">{{ icon }}</span>
      <span v-if="!onlyIcon">{{ $t(label) }}</span>
    </div>
  </li>
  <r-button v-else-if="type === 'button'" :size="size ? size : ''" @click="navigate">
    <span v-if="icon" class="material-icons">{{ icon }}</span>
    &nbsp;
    <span v-if="!onlyIcon">{{ label }}</span>
  </r-button>
  <p v-else-if="type === 'plain'" :size="size ? size : ''" @click="navigate">
    <span v-if="!onlyIcon">{{ label }}</span>
  </p>
  <li v-else-if="type === 'list-custom'" class="navigation-menu-item" :class="{ isMenuExpanded: 'justify-center' }">
    <slot />
  </li>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { defineComponent } from 'vue'

import RButton from '@/components/ui/RButton.vue'
import { useMainStore } from '@/stores/mainStore'
export default defineComponent({
  components: { RButton },
  props: {
    type: {
      type: String,
      default: 'list'
    },
    routeName: {
      type: String,
      default: undefined
    },
    params: {
      type: Object,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: undefined
    },
    onlyIcon: {
      type: Boolean,
      default: false
    }
  },
  emits: ['navigated'],
  computed: {
    isActiveRoute() {
      return this.$router.currentRoute.value.name === this.routeName
    },
    ...mapState(useMainStore, ['isMenuExpanded'])
  },
  methods: {
    async navigate() {
      if (this.$router.currentRoute.value.name !== this.routeName) {
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
})
</script>

<style lang="postcss">
.navigation-menu-item {
  @apply flex flex-wrap items-center px-4 py-3 border-b border-gray-400 text-lg cursor-pointer transition ease-in-out h-14;
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
