import { formatAuditChanges } from '@/utils/filters/auditChangesFilter'
import { formatDate, formatDateTime } from '@/utils/filters/dateFilters'
import { arrayToString, capitalize, formatCurrency, uppercase } from '@/utils/filters/textFilters'

export default {
  uppercase,
  arrayToString,
  capitalize,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatAuditChanges
}
