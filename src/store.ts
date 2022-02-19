import StorageService from '@/services/StorageService'
import { createStore } from 'vuex'
import { getStartingLocale } from '@/services/LanguageService'
import { i18n } from '@/plugins/i18n'

const store = createStore({
  state: {
    currentUser: {},
    signedIn: false,
    csrf: null,
    appLanguage: StorageService.load('appLanguage') || getStartingLocale(),
    currentTitle: '',
    currentSubtitle: '',
    isMenuExpanded: true
  },
  getters: {
    currentUser: (state) => StorageService.load('currentUser') || state.currentUser,
    signedIn: (state) => StorageService.load('signedIn') || state.signedIn,
    csrf: (state) => StorageService.load('csrf') || state.csrf,
    appLanguage: (_) => StorageService.load('appLanguage') || getStartingLocale(),
    currentTitle: (state) => state.currentTitle,
    currentSubtitle: (state) => state.currentSubtitle,
    isMenuExpanded: (state) => StorageService.load('isMenuExpanded') || state.isMenuExpanded
  },
  mutations: {
    setLoggedInUser(_, { currentUser, csrf }) {
      StorageService.persist('currentUser', currentUser)
      StorageService.persist('signedIn', true)
      StorageService.persist('csrf', csrf)
    },
    setCurrentUser(_, { currentUser }) {
      StorageService.persist('currentUser', currentUser)
    },
    unsetCurrentUser(_) {
      StorageService.remove('currentUser')
      StorageService.remove('signedIn')
      StorageService.remove('csrf')
    },
    refresh(_, csrf) {
      StorageService.persist('signedIn', true)
      StorageService.persist('csrf', csrf)
    },
    setAppLanguage(_, language) {
      i18n.locale = language
      StorageService.persist('language', language)
    },
    setCurrentTitle(state, title) {
      state.currentTitle = title
    },
    setCurrentSubtitle(state, subtitle) {
      state.currentSubtitle = subtitle
    },
    unsetCurrentTitle(state) {
      state.currentTitle = ''
    },
    unsetCurrentSubtitle(state) {
      state.currentSubtitle = ''
    },
    setIsMenuExpanded(_, isMenuExpanded) {
      StorageService.persist('isMenuExpanded', isMenuExpanded)
    }
  }
})

export default store
