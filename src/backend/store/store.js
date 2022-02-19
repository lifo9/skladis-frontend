import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getStartingLocale } from '../services/LanguageService'
import { i18n } from '../..//plugins/i18n'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    currentUser: {},
    signedIn: false,
    csrf: null,
    appLanguage: localStorage.getItem('appLanguage') || getStartingLocale(),
    currentTitle: '',
    currentSubtitle: '',
    isMenuExpanded: true
  },
  getters: {
    getAppLanguage: state => state.appLanguage,
    isMenuExpanded: state => state.isMenuExpanded
  },
  mutations: {
    setLoggedInUser (state, { currentUser, csrf }) {
      state.currentUser = currentUser
      state.signedIn = true
      state.csrf = csrf
    },
    setCurrentUser (state, { currentUser }) {
      state.currentUser = currentUser
    },
    unsetCurrentUser (state) {
      state.currentUser = {}
      state.signedIn = false
      state.csrf = null
    },
    refresh (state, csrf) {
      state.signedIn = true
      state.csrf = csrf
    },
    setAppLanguage (state, language) {
      state.appLanguage = language
      i18n.locale = language
      localStorage.setItem('language', language)
    },
    setCurrentTitle (state, title) {
      state.currentTitle = title
    },
    setCurrentSubtitle (state, subtitle) {
      state.currentSubtitle = subtitle
    },
    unsetCurrentTitle (state) {
      state.currentTitle = ''
    },
    unsetCurrentSubtitle (state) {
      state.currentSubtitle = ''
    },
    setIsMenuExpanded (state, isMenuExpanded) {
      state.isMenuExpanded = isMenuExpanded
    }
  },
  plugins: [createPersistedState()]
})
