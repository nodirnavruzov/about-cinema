const { Markup } = require('telegraf');

module.exports = async (ctx, lang) => {
  return await ctx.reply('Меню', Markup
  .keyboard([
    ['Поиск', 'По жанру'],
    ['Топ', 'Популярыне'],
    ['Ваш список просмотра', 'Публичные списки просмотров'],
    ['⚙️ Настройки'],
  ]).oneTime().resize())  
}
