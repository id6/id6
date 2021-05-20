// https://github.com/i18next/i18next-parser#options
module.exports = {
  input: ['src/**/**.{js,jsx,ts,tsx}'],
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  locales: ['en', 'fr'],
  keySeparator: false,
  namespaceSeparator: false,
  createOldCatalogs: false,
  verbose: true,
}
