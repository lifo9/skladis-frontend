import { useMainStore } from '@/stores/mainStore'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function checkRole(el, binding, _vnode, _old) {
  let roles = binding.value
  if (!Array.isArray(roles)) {
    roles = [binding.value]
  }
  if (!isCurrentUserInRoles(roles)) {
    el.remove()
  }
}

export function isCurrentUserInRoles(roles) {
  const store = useMainStore()

  const currentUserRoles = store.currentUser.roles
  if (currentUserRoles && Array.isArray(currentUserRoles)) {
    for (let i = 0; i < currentUserRoles.length; i++) {
      if (roles.includes(currentUserRoles[i])) {
        return true
      }
    }
  }

  return false
}

export const role = {
  mounted: checkRole
}
