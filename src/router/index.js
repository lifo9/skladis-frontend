import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../backend/store/store'

// main views
import LoggedMainView from '../views/logged/LoggedMainView'
import GuestMainView from '../views/guest/GuestMainView'

// pages
import ActivateUser from '../components/ActivateUser'
import HomeView from '../views/logged/HomeView'

// contacts
import ContactsView from '../views/logged/ContactsView'
import CreateContact from '../components/admin/contacts/CreateContact'
import ViewContacts from '../components/admin/contacts/ViewContacts'

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

export default new Router({
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
              component: CreateContact
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
})
