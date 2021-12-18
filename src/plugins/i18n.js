import Vue from "vue";
import VueI18n from "vue-i18n";
import { getStartingLocale } from "../backend/services/LanguageService";

Vue.use(VueI18n);

// Load all locales and remember context
function loadMessages() {
  const context = require.context("../locales", true, /[a-z0-9-_]+\.json$/i);

  const messages = context
    .keys()
    .map((key) => ({ key, locale: key.match(/[a-z0-9-_]+/i)[0] }))
    .reduce(
      (messages, { key, locale }) => ({
        ...messages,
        [locale]: context(key),
      }),
      {}
    );
  return { context, messages };
}

const { context, messages } = loadMessages();

// VueI18n instance
const i18n = new VueI18n({
  fallbackWarn: false,
  missingWarn: false,
  locale: getStartingLocale(),
  fallbackLocale: "en",
  messages,
});

// Hot updates
if (module.hot) {
  module.hot.accept(context.id, () => {
    const { messages: newMessages } = loadMessages();

    Object.keys(newMessages)
      .filter((locale) => messages[locale] !== newMessages[locale])
      .forEach((locale) => {
        messages[locale] = newMessages[locale];
        i18n.setLocaleMessage(locale, messages[locale]);
      });
  });
}

export { i18n };
