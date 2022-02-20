<template>
  <div class="md:border-t">
    <a
      v-if="type === 'mobile'"
      class="flex justify-center items-center w-8 h-full text-2xl text-center text-white select-none material-icons-sharp"
      href="javascript:"
      @click="toggleMenu()"
    >
      menu
    </a>
    <div
      v-if="isOpen || type === 'desktop'"
      class="absolute top-16 left-0 z-50 px-0 w-full min-h-screen bg-gray-900 md:fixed md:z-auto"
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
          :only-icon="!mainStore.isMenuExpanded"
          v-on:navigated="toggleMenu"
        />
        <!-- <navigation-item
          route-name="VendorsView"
          label="Vendors"
          icon="business_center"
          :only-icon="!mainStore.isMenuExpanded"
          v-on:navigated="toggleMenu"
        /> -->
        <navigation-item
          route-name="SuppliersView"
          label="Suppliers"
          icon="directions_car"
          :only-icon="!mainStore.isMenuExpanded"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          v-role="constants.roles.admin || constants.roles.manager"
          route-name="WarehousesView"
          label="Warehouses"
          icon="warehouse"
          :only-icon="!mainStore.isMenuExpanded"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          v-role="constants.roles.admin || constants.roles.manager"
          route-name="RoomsView"
          label="Rooms"
          icon="meeting_room"
          :only-icon="!mainStore.isMenuExpanded"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          route-name="ContactsView"
          label="Contacts"
          icon="contacts"
          :only-icon="!mainStore.isMenuExpanded"
          v-on:navigated="toggleMenu"
        />
        <navigation-item
          v-role="constants.roles.admin"
          route-name="UsersView"
          label="Users"
          icon="person"
          :only-icon="!mainStore.isMenuExpanded"
          v-on:navigated="toggleMenu"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import NavigationItem from '@/components/NavigationItem.vue'
import { useMainStore } from '@/stores/mainStore'
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'
export default defineComponent({
  inject: ['constants'],
  components: { NavigationItem },
  props: {
    type: {
      type: String,
      default: 'mobile'
    }
  },
  computed: {
    ...mapStores(useMainStore)
  },
  data() {
    return {
      isOpen: false
    }
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
