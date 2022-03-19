import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import ActivateUser from '@/components/ActivateUser.vue'
import ViewAudits from '@/components/admin/audits/ViewAudits.vue'
import CreateEditContact from '@/components/admin/contacts/CreateEditContact.vue'
import ViewContacts from '@/components/admin/contacts/ViewContacts.vue'
import CreateEditInvoice from '@/components/admin/invoices/CreateEditInvoice.vue'
import ViewInvoices from '@/components/admin/invoices/ViewInvoices.vue'
import MyProfile from '@/components/admin/MyProfile.vue'
import CreateEditProduct from '@/components/admin/products/CreateEditProduct.vue'
import ViewProductPriceHistory from '@/components/admin/products/ViewProductPriceHistory.vue'
import ViewProducts from '@/components/admin/products/ViewProducts.vue'
import CreateEditRoom from '@/components/admin/rooms/CreateEditRoom.vue'
import ViewRooms from '@/components/admin/rooms/ViewRooms.vue'
import CreateEditSupplier from '@/components/admin/suppliers/CreateEditSupplier.vue'
import ViewSuppliers from '@/components/admin/suppliers/ViewSuppliers.vue'
import CreateEditUser from '@/components/admin/users/CreateEditUser.vue'
import ViewUsers from '@/components/admin/users/ViewUsers.vue'
import CreateEditVendor from '@/components/admin/vendors/CreateEditVendor.vue'
import ViewVendors from '@/components/admin/vendors/ViewVendors.vue'
import CreateEditWarehouse from '@/components/admin/warehouses/CreateEditWarehouse.vue'
import ViewWarehouses from '@/components/admin/warehouses/ViewWarehouses.vue'
import { CONSTANTS } from '@/plugins/constants'
import { useMainStore } from '@/stores/mainStore'
import { isCurrentUserInRoles } from '@/utils/directives/role'
import GuestMainView from '@/views/guest/GuestMainView.vue'
import UsersView from '@/views/logged/admin/UsersView.vue'
import AuditView from '@/views/logged/AuditView.vue'
import ContactsView from '@/views/logged/ContactsView.vue'
import HomeView from '@/views/logged/HomeView.vue'
import InvoicesView from '@/views/logged/InvoicesView.vue'
import LoggedMainView from '@/views/logged/LoggedMainView.vue'
import ProductsView from '@/views/logged/ProductsView.vue'
import RoomsView from '@/views/logged/RoomsView.vue'
import SuppliersView from '@/views/logged/SuppliersView.vue'
import VendorsView from '@/views/logged/VendorsView.vue'
import WarehousesView from '@/views/logged/WarehousesView.vue'

function redirectSignedOut(to, from, next) {
  const store = useMainStore()

  if (!store.signedIn) {
    next('/sign-in')
  }
  next()
}

function redirectSignedIn(to, from, next) {
  const store = useMainStore()

  if (store.signedIn) {
    next('/')
  }
  next()
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LoggedMainView,
    beforeEnter: (to, from, next) => {
      redirectSignedOut(to, from, next)
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: HomeView
      },
      {
        path: 'contacts',
        component: ContactsView,
        children: [
          {
            path: '',
            name: 'ContactsView',
            component: ViewContacts
          },
          {
            path: 'create',
            name: 'ContactsCreate',
            component: CreateEditContact
          },
          {
            path: 'edit/:id',
            name: 'ContactEdit',
            component: CreateEditContact
          }
        ]
      },
      {
        path: 'users',
        component: UsersView,
        children: [
          {
            path: '',
            name: 'UsersView',
            meta: {
              roles: [CONSTANTS.roles.admin]
            },
            component: ViewUsers
          },
          {
            path: 'create',
            name: 'UserCreate',
            meta: {
              roles: [CONSTANTS.roles.admin]
            },
            component: CreateEditUser
          },
          {
            path: 'edit/:id',
            name: 'UserEdit',
            meta: {
              roles: [CONSTANTS.roles.admin]
            },
            component: CreateEditUser
          }
        ]
      },
      {
        path: 'profile',
        name: 'MyProfile',
        component: MyProfile
      },
      {
        path: 'vendors',
        component: VendorsView,
        children: [
          {
            path: '',
            name: 'VendorsView',
            component: ViewVendors
          },
          {
            path: 'create',
            name: 'VendorsCreate',
            component: CreateEditVendor
          },
          {
            path: 'edit/:id',
            name: 'VendorEdit',
            component: CreateEditVendor
          }
        ]
      },
      {
        path: 'warehouses',
        component: WarehousesView,
        children: [
          {
            path: '',
            name: 'WarehousesView',
            component: ViewWarehouses
          },
          {
            path: 'create',
            name: 'WarehouseCreate',
            component: CreateEditWarehouse
          },
          {
            path: 'edit/:id',
            name: 'WarehouseEdit',
            component: CreateEditWarehouse
          }
        ]
      },
      {
        path: 'rooms',
        component: RoomsView,
        children: [
          {
            path: '',
            name: 'RoomsView',
            component: ViewRooms
          },
          {
            path: 'create',
            name: 'RoomCreate',
            component: CreateEditRoom
          },
          {
            path: 'edit/:id',
            name: 'RoomEdit',
            component: CreateEditRoom
          }
        ]
      },
      {
        path: 'suppliers',
        component: SuppliersView,
        children: [
          {
            path: '',
            name: 'SuppliersView',
            component: ViewSuppliers
          },
          {
            path: 'create',
            name: 'SupplierCreate',
            component: CreateEditSupplier
          },
          {
            path: 'edit/:id',
            name: 'SupplierEdit',
            component: CreateEditSupplier
          }
        ]
      },
      {
        path: 'products',
        component: ProductsView,
        children: [
          {
            path: '',
            name: 'ProductsView',
            component: ViewProducts
          },
          {
            path: 'create',
            name: 'ProductCreate',
            component: CreateEditProduct
          },
          {
            path: 'edit/:id',
            name: 'ProductEdit',
            component: CreateEditProduct
          },
          {
            path: 'price-history/:id',
            name: 'ProductPriceHistory',
            component: ViewProductPriceHistory
          }
        ]
      },
      {
        path: 'invoices',
        component: InvoicesView,
        children: [
          {
            path: '',
            name: 'InvoicesView',
            component: ViewInvoices
          },
          {
            path: 'create',
            name: 'InvoiceCreate',
            component: CreateEditInvoice
          },
          {
            path: 'edit/:id',
            name: 'InvoiceEdit',
            component: CreateEditInvoice
          }
        ]
      },
      {
        path: 'audits',
        component: AuditView,
        children: [
          {
            path: '',
            name: 'AuditsView',
            component: ViewAudits
          }
        ]
      }
    ]
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: GuestMainView,
    beforeEnter: (to, from, next) => {
      redirectSignedIn(to, from, next)
    }
  },
  {
    path: '/sign-up/:registration_key?',
    name: 'SignUp',
    component: GuestMainView,
    beforeEnter: (to, from, next) => {
      redirectSignedIn(to, from, next)
    },
    children: [
      {
        path: 'activate/:activation_key',
        name: 'ActivateUser',
        component: ActivateUser
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useMainStore()
  const requiredRoles = to.meta.roles

  store.unsetCurrentTitle()
  store.unsetCurrentSubtitle()

  if (requiredRoles && !isCurrentUserInRoles(requiredRoles)) {
    next('/')
  }
  next()
})

export default router
