import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../backend/store/store'

// main views
import LoggedMainView from '../views/logged/LoggedMainView'
import GuestMainView from '../views/guest/GuestMainView'

// pages
import HomeView from '../views/logged/HomeView'

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
      name: 'LoggedMainView',
      component: LoggedMainView,
      beforeEnter: (to, from, next) => {
        redirectSignedOut(to, from, next)
      },
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeView
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
      path: '/sign-up',
      name: 'SignUp',
      component: GuestMainView,
      beforeEnter: (to, from, next) => {
        redirectSignedIn(to, from, next)
      }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: GuestMainView,
      beforeEnter: (to, from, next) => {
        redirectSignedIn(to, from, next)
      }
    }
  ]
})
