import { checkRole } from '../backend/utils/directives/role'
import clickedOutside from '../backend/utils/directives/clickOutside'

export default {
  install (Vue) {
    Vue.directive('role', {
      inserted: checkRole
    })
  },
  clickedOutside
}
