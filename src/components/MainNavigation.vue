<template>
  <div class="md:border-t">
    <a
      class="text-2xl text-white transition ease-in-out select-none material-icons-sharp"
      :class="isOpen ? 'transform rotate-90 transition ease-in-out' : ''"
      href="javascript:"
      @click="toggleMenu()"
    >
      menu
    </a>
    <div
      v-if="isOpen || type === 'desktop'"
      class="absolute top-16 left-0 z-50 px-0 w-full min-h-screen bg-gray-900 transition ease-in-out md:fixed md:z-auto"
      :class="!mainStore.isMenuExpanded ? 'md:w-16' : 'md:w-64'"
    >
      <ul class="overflow-y-auto h-screen">
        <navigation-item
          v-if="type === 'desktop'"
          type="list-custom"
          class="space-x-2 text-white select-none"
          @click="toggleExpanded"
        >
          <div class="flex flex-wrap items-center space-x-2">
            <a
              class="text-2xl text-white transition ease-in-out select-none material-icons-sharp"
              :class="!mainStore.isMenuExpanded ? 'transform rotate-90 transition ease-in-out' : ''"
              href="javascript:"
              @click="toggleMenu()"
            >
              menu
            </a>
            <span v-if="mainStore.isMenuExpanded" class="transition ease-in-out">{{ $t('Menu') }}</span>
          </div>
        </navigation-item>
        <navigation-item
          route-name="Home"
          label="Home"
          icon="home"
          :only-icon="menuItemShowOnlyIcon"
          @navigated="toggleMenu"
        />
        <navigation-item
          v-role="[constants.roles.admin, constants.roles.manager]"
          route-name="OrdersView"
          label="Orders"
          icon="grading"
          :only-icon="menuItemShowOnlyIcon"
          @navigated="toggleMenu"
        />
        <navigation-item
          v-role="[constants.roles.admin, constants.roles.manager]"
          route-name="ProductsView"
          label="Products"
          icon="medical_services"
          :only-icon="menuItemShowOnlyIcon"
          @navigated="toggleMenu"
        />
        <navigation-item
          v-role="[constants.roles.admin, constants.roles.manager]"
          route-name="SuppliersView"
          label="Suppliers"
          icon="directions_car"
          :only-icon="menuItemShowOnlyIcon"
          @navigated="toggleMenu"
        />
        <navigation-item
          v-role="[constants.roles.admin, constants.roles.manager]"
          route-name="WarehousesView"
          label="Warehouses"
          icon="warehouse"
          :only-icon="menuItemShowOnlyIcon"
          @navigated="toggleMenu"
        />
        <navigation-item
          v-role="[constants.roles.admin, constants.roles.manager]"
          route-name="RoomsView"
          label="Rooms"
          icon="meeting_room"
          :only-icon="menuItemShowOnlyIcon"
          @navigated="toggleMenu"
        />
        <navigation-item
          route-name="ContactsView"
          label="Contacts"
          icon="contacts"
          :only-icon="menuItemShowOnlyIcon"
          @navigated="toggleMenu"
        />
        <navigation-item
          v-role="constants.roles.admin"
          route-name="UsersView"
          label="Users"
          icon="person"
          :only-icon="menuItemShowOnlyIcon"
          @navigated="toggleMenu"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import NavigationItem from '@/components/NavigationItem.vue'
import { useMainStore } from '@/stores/mainStore'
export default defineComponent({
  components: { NavigationItem },
  inject: ['constants'],
  props: {
    type: {
      type: String,
      default: 'mobile'
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    menuItemShowOnlyIcon() {
      return !this.mainStore.isMenuExpanded && this.type !== 'mobile'
    },
    ...mapStores(useMainStore)
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
    },
    toggleExpanded() {
      this.mainStore.setIsMenuExpanded(!this.mainStore.isMenuExpanded)
    }
  }
})
</script>
