import { i18n } from '@/plugins/i18n'

/* eslint-disable prefer-const */
export function getStartingLocale() {
  const browserLocale = getBrowserLocale()
  if (getAvailableLocales().includes(browserLocale)) {
    return browserLocale
  } else {
    return 'en'
  }
}

export function getAvailableLocales() {
  let availableLocales = []
  const languageFiles = import.meta.globEager('/src/locales/*.json')
  for (const filePath in languageFiles) {
    const fileName = filePath.replace(/^.*[\\/]/, '')
    const locale = fileName.replace(/\.[^/.]+$/, '')
    availableLocales.push(locale)
  }
  return availableLocales
}

export function getVueLocale() {
  return i18n.locale
}

function getBrowserLocale() {
  const navigatorLocale = navigator.languages !== undefined ? navigator.languages[0] : navigator.language

  if (!navigatorLocale) {
    return undefined
  }
  return navigatorLocale.trim().split(/-|_/)[0]
}
