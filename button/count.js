const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  await ctx.reply(ctx.i18n.t('chose_movie_count'), Markup
  .keyboard([
    ['50', '100'],
    ['150', '200'],
    ['250'],
  ]).oneTime().resize())  
}

