/** @type {import('next-i18next').UserConfig} */
const i18nConfig = {
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    localeDetection: false,
  },
  fallbackLng: 'es',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};

export default i18nConfig;
