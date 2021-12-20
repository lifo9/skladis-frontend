import { uppercase } from '../backend/utils/filters/TextFilters'

export default {
  install (Vue) {
    Vue.filter('uppercase', uppercase)
  }
}
