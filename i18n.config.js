const path = require('path');
const I18n = require('telegraf-i18n')

const i18n = new I18n({
  directory: path.resolve(__dirname, 'locales'),
  defaultLanguage: 'ru',
  useSession: true,
})

module.exports = i18n;
