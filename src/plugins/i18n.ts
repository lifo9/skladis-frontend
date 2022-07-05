/* eslint-disable prefer-const */
import { createI18n } from 'vue-i18n'

import { getStartingLocale } from '@/services/LanguageService'
import StorageService from '@/services/StorageService'

// Load all locales and remember context
function loadMessages() {
  let messages = {}
  const languageFiles = import.meta.glob('/src/locales/*.json', { as: 'raw' })
  for (const filePath in languageFiles) {
    const fileName = filePath.replace(/^.*[\\/]/, '')
    const locale = fileName.replace(/\.[^/.]+$/, '')
    messages[locale] = JSON.parse(languageFiles[filePath])
  }

  return messages
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

// Hot updates
if (import.meta.hot) {
  import.meta.hot.accept('/src/locales/*.json', () => {
    const newMessages = loadMessages()

    for (const locale in newMessages) {
      i18n.global.setLocaleMessage(locale, newMessages[locale])
    }
  })
}

export { i18n }
