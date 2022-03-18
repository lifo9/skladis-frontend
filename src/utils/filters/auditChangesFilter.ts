import { i18n } from '@/plugins/i18n'

const { t } = i18n.global

export function formatAuditChanges(changes) {
  return renameKeys(changes, Object.fromEntries(Object.keys(changes).map((key) => [key, t(key)])))
}

function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key
    return { [newKey]: obj[key] }
  })
  return Object.assign({}, ...keyValues)
}
