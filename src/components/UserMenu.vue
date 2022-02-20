<template>
  <div v-click-outside="hideMenu" class="flex relative text-gray-800 bg-white rounded-full cursor-pointer">
    <div>
      <div @click="toggleMenu">
        <span class="w-8 text-2xl text-center select-none material-icons-sharp">person</span>
        <span class="w-8 text-2xl text-center rounded-full select-none material-icons-sharp hoverable">
          arrow_drop_down
        </span>
      </div>

      <div
        class="absolute top-full right-0 z-50 py-1 mt-1.5 w-48 bg-white rounded-md shadow-lg"
        :class="[menuHidden ? 'hidden' : '']"
      >
        <ul class="user-menu">
          <li v-if="mainStore.signedIn" class="not-hoverable">
            <p>{{ mainStore.currentUser.email }}</p>
          </li>
          <li v-if="mainStore.signedIn" @click="hideMenu">
            <navigation-item class="text-left" type="plain" route-name="MyProfile" :label="$t('My profile')" />
          </li>
          <li class="not-hoverable">
            <p><language-switcher @input="hideMenu" /></p>
          </li>
          <li v-if="!mainStore.signedIn" @click="navigate('SignIn')">
            <p>{{ $t('Sign In') }}</p>
          </li>
          <li v-if="mainStore.signedIn" @click="hideMenu">
            <logout />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import Logout from '@/components/Logout.vue'
import NavigationItem from '@/components/NavigationItem.vue'
import { useMainStore } from '@/stores/mainStore'
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'
export default defineComponent({
  components: { Logout, LanguageSwitcher, NavigationItem },
  data() {
    return {
      menuHidden: true
    }
  },
  computed: {
    ...mapStores(useMainStore)
  },
  methods: {
    navigate(routeName) {
      if (this.$router.currentRoute.name !== routeName) {
        const route = this.$router.resolve({ name: routeName })
        this.$router.push(route.href)
      }
      this.toggleMenu()
    },
    toggleMenu() {
      this.menuHidden = !this.menuHidden
    },
    hideMenu() {
      if (!this.menuHidden) {
        this.menuHidden = true
      }
    }
  }
})
</script>

<style lang="postcss">
.user-menu li {
  @apply block text-gray-700 hover:bg-gray-200 border-b;
}
.user-menu li:last-of-type {
  @apply border-none;
}
.user-menu p {
  @apply px-4 py-2;
}
.not-hoverable {
  @apply hover:bg-white !important;
}
</style>
