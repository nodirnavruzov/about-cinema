module.exports = async (ctx) => {
  return await ctx.replyWithHTML(`
/lang - ${ctx.i18n.t('lang')},
/menu - ${ctx.i18n.t('menu')},
/search - ${ctx.i18n.t('search_by_name')},
/top - ${ctx.i18n.t('top')},
/popular - ${ctx.i18n.t('popular')}
`)
}