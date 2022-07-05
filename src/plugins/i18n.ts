/* eslint-disable prefer-const */
import { createI18n } from 'vue-i18n'

import { getStartingLocale } from '@/services/LanguageService'
import StorageService from '@/services/StorageService'

const localeFiles = import.meta.globEager('/src/locales/*.json')

// Transforms `path/to/locale.json` to `locale`
const getLocaleFromPath = (path: string) => path.split('/').pop().split('.')[0]

// Load all locales and remember context
function loadMessages() {
  return Object.entries(localeFiles).reduce(
    (acc, [path, content]) => ({
      ...acc,
      [getLocaleFromPath(path)]: content.default
    }),
    {}
  )
}

const messages = loadMessages()

// VueI18n instance
const i18n = createI18n({
  fallbackWarn: false,
  missingWarn: false,
  locale: StorageService.load('main', 'appLanguage') || getStartingLocale(),
  fallbackLocale: 'en',
  messages
})

export { i18n }
