import StorageService from '@/services/StorageService'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getStartingLocale, setLocale } from '@/services/LanguageService'

const STORE_ID = 'main'

export const useMainStore = defineStore({
  id: STORE_ID,

  state: () => ({
    currentUser: StorageService.load(STORE_ID, 'currentUser') || {},
    signedIn: StorageService.load(STORE_ID, 'signedIn') || false,
    csrf: StorageService.load(STORE_ID, 'csrf') || undefined,
    appLanguage: StorageService.load(STORE_ID, 'appLanguage') || getStartingLocale(),
    isMenuExpanded: StorageService.load(STORE_ID, 'isMenuExpanded', true),
    currentTitle: '',
    currentSubtitle: ''
  }),
  actions: {
    setLoggedInUser(currentUser, csrf) {
      const copyCurrentUser = { ...currentUser }

      StorageService.persist(STORE_ID, 'currentUser', copyCurrentUser)
      StorageService.persist(STORE_ID, 'signedIn', true)
      StorageService.persist(STORE_ID, 'csrf', csrf)
      this.currentUser = currentUser
      this.signedIn = true
      this.csrf = csrf
    },
    setCurrentUser(currentUser) {
      const copyCurrentUser = { ...currentUser }

      StorageService.persist(STORE_ID, 'currentUser', copyCurrentUser)
      this.currentUser = currentUser
    },
    unsetCurrentUser() {
      StorageService.remove(STORE_ID, 'currentUser')
      StorageService.remove(STORE_ID, 'signedIn')
      StorageService.remove(STORE_ID, 'csrf')
      this.currentUser = {}
      this.signedIn = false
      this.csrf = undefined
    },
    refresh(csrf) {
      StorageService.persist(STORE_ID, 'signedIn', true)
      StorageService.persist(STORE_ID, 'csrf', csrf)
      this.signedIn = true
      this.csrf = csrf
    },
    setAppLanguage(language) {
      setLocale(language)

      StorageService.persist(STORE_ID, 'appLanguage', language)
      this.appLanguage = language
    },
    setCurrentTitle(title) {
      this.currentTitle = title
    },
    setCurrentSubtitle(subtitle) {
      this.currentSubtitle = subtitle
    },
    unsetCurrentTitle() {
      this.currentTitle = ''
    },
    unsetCurrentSubtitle() {
      this.currentSubtitle = ''
    },
    setIsMenuExpanded(isMenuExpanded) {
      StorageService.persist(STORE_ID, 'isMenuExpanded', isMenuExpanded)
      this.isMenuExpanded = isMenuExpanded
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
