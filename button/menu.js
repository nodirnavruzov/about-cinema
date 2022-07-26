const { Markup } = require('telegraf');

module.exports = async (ctx, lang) => {
  return await ctx.reply('Меню', Markup
  .keyboard([
    ['Поиск'],
    ['По жанру'],
    ['Топ', 'Популярыне'],
    ['Список просмотра'],
  ]).oneTime().resize())  
}
