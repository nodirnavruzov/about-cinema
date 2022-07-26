module.exports.commandHandler = (ctx, next) => {
  let text = ctx.update.message.text
  text = text.toLowerCase()
  switch (text) {
    case '/watchlist':
      ctx.scene.enter('watchlistScene')
      break;
    case 'список просмотра':
      ctx.scene.enter('watchlistScene')
      break;
    case '/search':
      ctx.scene.enter('searchCinemaScene')
      break;
    case 'поиск':
      ctx.scene.enter('searchCinemaScene')
      break;
    case '/top':
      ctx.scene.enter('topScene')
      break;
    case 'топ':
      ctx.scene.enter('topScene')
      break;
    case '/popular':
      ctx.scene.enter('popularScene')
      break;
    case 'популярыне':
      ctx.scene.enter('popularScene')
      break;
    case '/genre':
      ctx.scene.enter('searchByFilterScene')
      break;
    case 'по жанру':
      ctx.scene.enter('searchByFilterScene')
      break;
    default:
      next()
      break;
  }
}