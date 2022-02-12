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
        <navigation-item
          route-name="Home"
          label="Home"
          icon="home"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          v-role="constants.roles.admin || constants.roles.manager"
          route-name="WarehousesView"
          label="Warehouses"
          icon="warehouse"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          v-role="constants.roles.admin || constants.roles.manager"
          route-name="RoomsView"
          label="Rooms"
          icon="meeting_room"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          route-name="VendorsView"
          label="Vendors"
          icon="business_center"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          route-name="ContactsView"
          label="Contacts"
          icon="contacts"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          v-role="constants.roles.admin"
          route-name="UsersView"
          label="Users"
          icon="person"
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
      isOpen: false
    }
  },

  methods: {
    toggleMenu () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>
