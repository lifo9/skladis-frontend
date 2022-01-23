import { store } from '../../store/store'

export function checkRole (el, binding, vnode, old) {
  const role = binding.value

  if (!isCurrentUserInRole(role)) {
    el.remove()
  }
}

export function isCurrentUserInRole (role) {
  const currentUserRoles = store.state.currentUser.roles

  if (currentUserRoles && currentUserRoles.includes(role)) {
    return true
  }

  return false
}
