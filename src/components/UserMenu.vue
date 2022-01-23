<template>
  <div class="relative flex text-gray-800 bg-white rounded-full cursor-pointer">
    <div @click="toggleMenu" v-click-outside="hideMenu">
      <span class="w-8 text-2xl text-center select-none material-icons-sharp"
        >person</span
      >
      <span
        class="w-8 text-2xl text-center rounded-full select-none material-icons-sharp hoverable"
        >arrow_drop_down</span
      >
    </div>
    <div
      class="absolute z-50 right-0 mt-1.5 w-48 top-full rounded-md shadow-lg py-1 bg-white"
      :class="[menuHidden ? 'hidden' : '']"
    >
      <ul class="user-menu">
        <li v-if="this.$store.state.signedIn" class="not-hoverable">
          <p>{{ this.$store.state.currentUser.email }}</p>
        </li>
        <li v-if="this.$store.state.signedIn">
          <navigation-item
            class="text-left"
            type="plain"
            route-name="MyProfile"
            label="My profile"
          />
        </li>
        <li class="not-hoverable">
          <p><language-switcher @input="toggleMenu" /></p>
        </li>
        <li v-if="!this.$store.state.signedIn" @click="navigate('SignIn')">
          <p>{{ $t('Sign In') }}</p>
        </li>
        <li v-if="this.$store.state.signedIn">
          <logout />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import LanguageSwitcher from './LanguageSwitcher.vue'
import Logout from './Logout.vue'
import NavigationItem from './NavigationItem.vue'
export default {
  components: { Logout, LanguageSwitcher, NavigationItem },
  data () {
    return {
      menuHidden: true
    }
  },
  methods: {
    navigate (routeName) {
      if (this.$router.currentRoute.name !== routeName) {
        const route = this.$router.resolve({ name: routeName })
        this.$router.push(route.href)
      }
      this.toggleMenu()
    },
    toggleMenu () {
      this.menuHidden = !this.menuHidden
    },
    hideMenu () {
      if (!this.menuHidden) {
        this.menuHidden = true
      }
    }
  }
}
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
