const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  return await ctx.reply(ctx.i18n.t('select_lang'), Markup
  .keyboard([
    ['Ru 🇷🇺 Кинопоиск', 'En 🇺🇸 IMDB'],
  ]).oneTime().resize())  
}
