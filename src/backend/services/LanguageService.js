import { i18n } from '../../plugins/i18n'

export function getStartingLocale () {
  const browserLocale = getBrowserLocale()
  if (getAvailableLocales().includes(browserLocale)) {
    return browserLocale
  } else {
    return 'en'
  }
}

export function getAvailableLocales () {
  const context = require.context('../../locales', true, /[a-z0-9-_]+\.json$/i)

  return context.keys().map(key => key.match(/[a-z0-9-_]+/i)[0])
}

export function getVueLocale () {
  return i18n.locale
}

function getBrowserLocale () {
  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language

  if (!navigatorLocale) {
    return undefined
  }
  return navigatorLocale.trim().split(/-|_/)[0]
}
