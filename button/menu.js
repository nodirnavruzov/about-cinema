const { Markup } = require('telegraf');

module.exports = async (ctx, lang) => {
  return await ctx.reply(ctx.i18n.t('select_menu'), Markup
  .keyboard([
    ctx.i18n.languageCode === 'ru' ? ['Подборка'] : [],
    [ctx.i18n.t('search')],
    [ctx.i18n.t('popular'), ctx.i18n.t('top')],
  ]).oneTime().resize())  
}
