const { Scenes, Markup, Telegraf } = require('telegraf');
const countButton = require('../button/count');
const helpButton = require('../button/help')
const menuButton = require('../button/menu');
const kinopoiskPopularMovies  = require('../movies/kinopoisk/popular.json')
const imdbPopularMovies  = require('../movies/imdb/popular.json')
const { commandHandler } = require('../handler/commandHandler');
const axios = require('axios');
const filterMenu = require('../button/filterMenu');
const Watchlist = require('../model/watchlist');
const { createSkeleton, parseData } = require('../utils/skeleton');
const parserToHTML = require('../utils/parser/watchlistHTML');
const trailer = require('../getTrailer')



const watchlist = new Scenes.BaseScene('watchlistScene')


watchlist.enter(async (ctx) => {
  const userId = ctx.update.message.from.id
  const userWatchlist = await Watchlist.find({tg_id: userId, status: true})
  await sendMessage(ctx, userWatchlist)
  // return watchlist 
})



watchlist.help(async (ctx) => {
  helpButton(ctx)
})

watchlist.command('menu', async (ctx) => {
  menuButton(ctx)
})

watchlist.command('lang', async (ctx) => {
  ctx.scene.enter('languageScene')
})

watchlist.command('search', async (ctx) => {
  ctx.scene.enter('searchCinemaScene')
})

watchlist.command('top', async (ctx) => {
  ctx.scene.enter('topScene')
})

watchlist.command('popular', async (ctx) => {
  ctx.scene.enter('popularScene')
})

watchlist.command('watchlist', async (ctx) => {
  ctx.scene.enter('watchlistScene')
})

watchlist.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
  }
})

watchlist.action(/^\d+$/ , async (ctx) => {
  try {
  } catch (error) {
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
  }
})

// delete from WL
watchlist.action(/(wl_.+)/, async (ctx) => {
  try {
    const userId = ctx.update.callback_query.from.id
    const match = ctx.match[0]
    const filmId = match.slice(3)
    const result = await Watchlist.findOneAndUpdate({film_id: filmId, tg_id: userId}, {status: false})
    await ctx.reply(`${result.title} ${ctx.i18n.t('deleted_watchlist')}`)
    await ctx.answerCbQuery()
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
  }
})


// если не начинается с wl_
watchlist.action(/^(?!wl_).*$/, async (ctx) => {
  try {
    const filmTitle = ctx.match[0]
    const url = await trailer(filmTitle)
    await ctx.reply(url) 
    await ctx.answerCbQuery()
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
  }
})


async function sendMessage(ctx, films) {
  try {
    const parsed = parserToHTML(films)
    for (let i = 0; i < parsed.length; i++) {
      const film = parsed[i];
      if (film.title && film.title.length > 21) {
        film.title = film.title.slice(0, 21)
      }
      await ctx.replyWithPhoto({url: film.poster}, { caption: film.html, parse_mode: 'HTML',
      ...Markup.inlineKeyboard(
        [
          [
              Markup.button.callback(`${ctx.i18n.t('trailer')}`, `${film.title}`), 
              Markup.button.callback(`${ctx.i18n.t('delete_watchlist')}`, `wl_${film.film_id}`), 
          ]
        ]
      )})
    }
  } catch (error) {
    console.log('error sendMessage', error)
  }
}


module.exports = watchlist
