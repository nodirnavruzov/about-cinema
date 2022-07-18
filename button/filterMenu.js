const { Markup } = require('telegraf');
const getGenres = require('../getGenres');

module.exports = async (ctx) => {
  const genres = await getGenres()
  let markupArray = []
  let btnArray = []
  console.log('Filter menu')
  
  for (let i = 0; i < genres.length; i++) {
    const genre = genres[i];
    markupArray.push(Markup.button.callback(genre.genre, genre.id))
    if (markupArray.length === 3) {
      btnArray.push(markupArray)
      markupArray = []
    }
  }
  if (markupArray.length) {
    btnArray.push(markupArray)
  }
  console.log('btnArray', btnArray)
  return await ctx.reply('Выберите жанр', { parse_mode: 'HTML',
  ...Markup.inlineKeyboard(
    btnArray
  )})
}
