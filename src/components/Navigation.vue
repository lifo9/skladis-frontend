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
      class="absolute left-0 z-50 w-full min-h-screen px-0 bg-gray-900 md:z-auto md:fixed top-16"
      :class="!isExpandend ? 'md:w-16' : 'md:w-64'"
    >
      <ul class="h-screen overflow-y-auto">
        <navigation-item
          v-if="type === 'desktop'"
          type="list-custom"
          class="space-x-2 text-white select-none"
          @click="toggleExpanded"
        >
          <div class="flex flex-wrap items-center space-x-2">
            <a
              class="text-2xl text-white transition ease-in-out select-none material-icons-sharp"
              :class="
                !isExpandend ? 'transform rotate-90 transition ease-in-out' : ''
              "
              href="javascript:"
              @click="toggleMenu()"
            >
              menu
            </a>
            <span v-if="isExpandend" class="transition ease-in-out">{{
              $t('Menu')
            }}</span>
          </div>
        </navigation-item>
        <navigation-item
          route-name="Home"
          label="Home"
          icon="home"
          :only-icon="!isExpandend"
          v-on:navigated="toggleMenu"
        />
        <!-- <navigation-item
          route-name="VendorsView"
          label="Vendors"
          icon="business_center"
          :only-icon="!isExpandend"
          v-on:navigated="toggleMenu"
        /> -->
        <navigation-item
          route-name="SuppliersView"
          label="Suppliers"
          icon="directions_car"
          :only-icon="!isExpandend"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          v-role="constants.roles.admin || constants.roles.manager"
          route-name="WarehousesView"
          label="Warehouses"
          icon="warehouse"
          :only-icon="!isExpandend"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          v-role="constants.roles.admin || constants.roles.manager"
          route-name="RoomsView"
          label="Rooms"
          icon="meeting_room"
          :only-icon="!isExpandend"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          route-name="ContactsView"
          label="Contacts"
          icon="contacts"
          :only-icon="!isExpandend"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          v-role="constants.roles.admin"
          route-name="UsersView"
          label="Users"
          icon="person"
          :only-icon="!isExpandend"
          v-on:navigated="toggleMenu"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import NavigationItem from './NavigationItem.vue'
export default {
  components: { NavigationItem },
  props: {
    type: {
      type: String,
      default: 'mobile'
    }
  },

  data () {
    return {
      isOpen: false,
      isExpandend: this.$store.getters.isMenuExpanded
    }
  },

  methods: {
    toggleMenu () {
      this.isOpen = !this.isOpen
    },
    toggleExpanded () {
      this.$store.commit('setIsMenuExpanded', !this.isExpandend)
      this.isExpandend = !this.isExpandend
    }
  }
}
</script>
