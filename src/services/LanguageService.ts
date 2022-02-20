import { i18n } from '@/plugins/i18n'

/* eslint-disable prefer-const */
export function getStartingLocale() {
  const browserLocale = getBrowserLocale()
  if (i18n.global.availableLocales.includes(browserLocale)) {
    return browserLocale
  } else {
    return 'en'
  }
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
