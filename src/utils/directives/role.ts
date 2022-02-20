import { useMainStore } from '@/stores/mainStore'

function checkRole(el, binding, vnode, old) {
  const role = binding.value

  if (!isCurrentUserInRole(role)) {
    el.remove()
  }
}

export function isCurrentUserInRole(role) {
  const store = useMainStore()

  const currentUserRoles = store.currentUser.roles

  if (currentUserRoles && currentUserRoles.includes(role)) {
    return true
  }

  return false
}

export const role = {
  mounted: checkRole
}
