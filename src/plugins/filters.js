import { uppercase, arrayToString } from '../backend/utils/filters/TextFilters'

export default {
  install (Vue) {
    Vue.filter('uppercase', uppercase)
    Vue.filter('arrayToString', arrayToString)
  }
}
