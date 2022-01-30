import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../backend/store/store'
import { isCurrentUserInRole } from '../backend/utils/directives/role'
import { CONSTANTS } from '../plugins/constants'

// main views
import LoggedMainView from '../views/logged/LoggedMainView'
import GuestMainView from '../views/guest/GuestMainView'

// pages
import ActivateUser from '../components/ActivateUser'
import HomeView from '../views/logged/HomeView'

// contacts
import ContactsView from '../views/logged/ContactsView'
import CreateEditContact from '../components/admin/contacts/CreateEditContact'
import ViewContacts from '../components/admin/contacts/ViewContacts'

// users
import UsersView from '../views/logged/admin/UsersView'
import ViewUsers from '../components/admin/users/ViewUsers'
import CreateEditUser from '../components/admin/users/CreateEditUser'

import MyProfile from '../components/admin/MyProfile'

Vue.use(Router)

function redirectSignedOut (to, from, next) {
  if (!store.state.signedIn) {
    next('/sign-in')
  }
  next()
}

function redirectSignedIn (to, from, next) {
  if (store.state.signedIn) {
    next('/')
  }
  next()
}

export const router = new Router({
  mode: 'history',
  routes: [
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
              name: 'ContactsEdit',
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
                role: CONSTANTS.roles.admin
              },
              component: ViewUsers
            },
            {
              path: 'create',
              name: 'UserCreate',
              meta: {
                role: CONSTANTS.roles.admin
              },
              component: CreateEditUser
            },
            {
              path: 'edit/:id',
              name: 'UserEdit',
              meta: {
                role: CONSTANTS.roles.admin
              },
              component: CreateEditUser
            }
          ]
        },
        {
          path: 'profile',
          name: 'MyProfile',
          component: MyProfile
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
})

router.beforeEach((to, from, next) => {
  const requiredRole = to.meta.role

  store.commit('unsetCurrentTitle')

  if (requiredRole && !isCurrentUserInRole(requiredRole)) {
    next('/')
  }
  next()
})
