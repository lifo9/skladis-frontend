import store from '@/store'

function checkRole(el, binding, vnode, old) {
  const role = binding.value

  if (!isCurrentUserInRole(role)) {
    el.remove()
  }
}

export function isCurrentUserInRole(role) {
  const currentUserRoles = store.getters.currentUser.roles

  if (currentUserRoles && currentUserRoles.includes(role)) {
    return true
  }

  return false
}

export const role = {
  mounted: checkRole
}
