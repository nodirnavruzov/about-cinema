module.exports = async (ctx) => {
  return await ctx.replyWithHTML(`
/menu - Меню,
/search - Поиск по названию,
/genre - Лучшие фильмы по жанрам
/top - Топ,
/popular - Популярыне
`)
}