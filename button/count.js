const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  await ctx.reply('Выбери количество фильмов', Markup
  .keyboard([
    ['5', '10'],
    ['15', '20'],
  ]).oneTime().resize())  
}

