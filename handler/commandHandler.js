module.exports.commandHandler = (ctx, next) => {
  let text = ctx.update.message.text
  text = text.toLowerCase()
  switch (text) {
    case ctx.i18n.t('watchlist').toLowerCase():
      // console.log('watchlist')
      ctx.scene.enter('watchlistScene')
      break;
    case ctx.i18n.t('search').toLowerCase():
      // console.log('search')
      ctx.scene.enter('searchCinemaScene')
      break;
    case ctx.i18n.t('top').toLowerCase():
      // console.log('top')
      ctx.scene.enter('topScene')
      break;
    case ctx.i18n.t('popular').toLowerCase():
      // console.log('popular')
      ctx.scene.enter('popularScene')
      break;
    case 'подборка':
      // console.log('popular')
      ctx.scene.enter('searchByFilterScene')
      break;
    default:
      next()
      break;
  }
}