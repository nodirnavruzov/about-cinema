const { Scenes, Markup, Telegraf } = require('telegraf');
const helpButton = require('../button/help')
const menuButton = require('../button/menu');
const { commandHandler } = require('../handler/commandHandler');
const Watchlist = require('../model/watchlist');
const parserToHTML = require('../utils/skeleton/watchlistHTML');
const trailer = require('../utils/functions/getTrailer')



const watchlist = new Scenes.BaseScene('watchlistScene')


watchlist.enter(async (ctx) => {
  const userId = ctx.update.message.from.id
  const userWatchlist = await Watchlist.find({tg_id: userId, status: true})
  if (userWatchlist.length) {
    await sendMessage(ctx, userWatchlist)
  } else {
    await ctx.reply('Ваш плейлист пуст')
  }
})

watchlist.help(async (ctx) => {
  helpButton(ctx)
})

watchlist.start(async (ctx) => {
  try {
    await ctx.reply(`Привет ${ctx.update.message.from.first_name} 🥰 Я знаю много информацию о фильмах 🙃`)
    await ctx.reply(`Хочешь найти информацию о фильме? /help`)
  } catch (error) {
    console.log('error', error)
  }
})

watchlist.command('menu', async (ctx) => {
  menuButton(ctx)
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

// delete from WL
watchlist.action(/(wl_.+)/, async (ctx) => {
  try {
    const userId = ctx.update.callback_query.from.id
    const match = ctx.match[0]
    const filmId = match.slice(3)
    const result = await Watchlist.findOneAndUpdate({kinopoiskId: filmId, tg_id: userId}, {status: false})
    await ctx.reply(`${result.nameRu ? result.nameRu : result.nameOriginal} Удаленно из списка просмотра`)
    await ctx.answerCbQuery()
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
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
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
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
              Markup.button.callback(`Трейлер`, `${film.title}`), 
              Markup.button.callback(`Удалить из списка`, `wl_${film.filmId}`), 
          ]
        ]
      )})
    }
  } catch (error) {
    console.log('error sendMessage', error)
  }
}


module.exports = watchlist
