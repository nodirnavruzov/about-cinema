module.exports = async (ctx) => {
  return await ctx.replyWithHTML(`
/menu - Меню,
/search - Поиск по названию,
/top - Топ,
/popular - Популярыне
`)
}