import { checkRole } from '../backend/utils/directives/role'

export default {
  install (Vue) {
    Vue.directive('role', {
      inserted: checkRole
    })
  }
}
