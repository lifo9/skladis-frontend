<template>
  <li
    v-if="type === 'list'"
    @click="navigate"
    class="navigation-menu-item"
    :class="{ isActiveRoute: 'active', isMenuExpanded: 'justify-center' }"
  >
    <div class="flex flex-wrap space-x-2">
      <span v-if="icon" class="material-icons">{{ icon }}</span>
      <span v-if="!onlyIcon">{{ $t(label) }}</span>
    </div>
  </li>
  <r-button v-else-if="type === 'button'" @click="navigate" :size="size ? size : ''">
    <span v-if="icon" class="material-icons">{{ icon }}</span>
    &nbsp;
    <span v-if="!onlyIcon">{{ label }}</span>
  </r-button>
  <p v-else-if="type === 'plain'" @click="navigate" :size="size ? size : ''">
    <span v-if="!onlyIcon">{{ label }}</span>
  </p>
  <li v-else-if="type === 'list-custom'" class="navigation-menu-item" :class="{ isMenuExpanded: 'justify-center' }">
    <slot />
  </li>
</template>

<script lang="ts">
import RButton from '@/components/ui/RButton.vue'
import { useMainStore } from '@/stores/mainStore'
import { mapState } from 'pinia'

import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['navigated'],
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
      default: undefined
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
  computed: {
    isActiveRoute() {
      return this.$router.currentRoute.name === this.routeName
    },
    ...mapState(useMainStore, ['isMenuExpanded'])
  },
  methods: {
    async navigate() {
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
