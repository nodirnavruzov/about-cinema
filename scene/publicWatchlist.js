const { Scenes, Markup, Telegraf } = require('telegraf');
const PublicWatchlist = require('../model/publicWatchlist');
const Watchlist = require('../model/watchlist');
const parserToHTML = require('../utils/skeleton/watchlistHTML');
const addToWatchlist = require('../utils/functions/addToWatchlist');
const trailer = require('../utils/functions/getTrailer')

const publicWatchlistScene = new Scenes.BaseScene('publicWatchlistScene')

publicWatchlistScene.enter(async (ctx) => {
  try {
    ctx.session.publicWatchlist = {
      page: 0,
      limit: 5,
      wluser: ''
    }
    const users = await PublicWatchlist.find({status: true}, 'username tg_id').exec()
    const list = await createList(ctx, users)
    const html = createHTML(list)
    await sendList(ctx, html)
  } catch(error) {
    console.log(error)
  }
})

publicWatchlistScene.start(async (ctx) => {
  try {
    await ctx.reply(`Привет ${ctx.update.message.from.first_name} 🥰 Я знаю много информацию о фильмах 🙃`)
    await ctx.reply(`Хочешь найти информацию о фильме? /help`)
  } catch (error) {
    console.log('error', error)
  }
})

publicWatchlistScene.help(async (ctx) => {
  helpButton(ctx)
})

publicWatchlistScene.command('menu', async (ctx) => {
  menuButton(ctx)
})

publicWatchlistScene.command('search', async (ctx) => {
  ctx.scene.enter('searchCinemaScene')
})

publicWatchlistScene.command('top', async (ctx) => {
  ctx.scene.enter('topScene')
})

publicWatchlistScene.command('popular', async (ctx) => {
  ctx.scene.enter('popularScene')
})

publicWatchlistScene.command('watchlist', async (ctx) => {
  ctx.scene.enter('watchlistScene')
})

publicWatchlistScene.command('publicwl', async (ctx) => {
  ctx.scene.enter('publicWatchlistScene')
})

publicWatchlistScene.command('settings', async (ctx) => {
  ctx.scene.enter('settingsScene')
})




publicWatchlistScene.action('more' , async (ctx) => {
  try {
    await ctx.answerCbQuery()
    let username = ctx.session.publicWatchlist.wluser
    const movies = await getMovies(ctx, username)
    await sendMessage(ctx, movies)
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

publicWatchlistScene.action(/(wl_.+)/, async (ctx) => {
  try {
    const match = ctx.match[0]
    addToWatchlist(ctx)
    await ctx.answerCbQuery()
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})
publicWatchlistScene.action(/^(?!id_).*$/, async (ctx) => {
  try {
    await ctx.answerCbQuery()
    const filmTitle = ctx.match[0]
    const url = await trailer(filmTitle)
    ctx.reply(url) 
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})


publicWatchlistScene.on('text', async (ctx) => {
  try {
    let username = ctx.update.message.text
    username = username.substring(1)
    ctx.session.publicWatchlist.wluser = username 
    const movies = await getMovies(ctx, username)
    await sendMessage(ctx, movies)
  } catch (error) {
    console.log(error)    
  }
})


async function createList(ctx, data) {
  console.log('createList', data)
  try {
    const userArray = []
    for (let i = 0; i < data.length; i++) {
      const user = data[i];
      const movies = await Watchlist.find({tg_id: user.tg_id, status: true})
      userArray.push({
        user,
        total: movies.length
      })
    }
    return userArray
  } catch(error) {
    console.log(error)
  }
}

function createHTML(data) {
  console.log('createHTML', data)
  let html
  for (let i = 0; i < data.length; i++) {
    const user = data[i]
    if (html) {
      html +=`● <b>/${user.user.username} Movies: ${user.total}</b>`
    } else {
      html =`● <b>/${user.user.username} Movies: ${user.total}</b>`
    }
  }
  return html
} 


async function sendList(ctx, html) {
  try {
    await ctx.replyWithHTML(html, {parse_mode: 'HTML'})
  } catch (error) {
    console.log(error)
  } 
}

async function getMovies(ctx, username) {
  try {
    let limit = ctx.session.publicWatchlist.limit
    let page = ctx.session.publicWatchlist.page
    var query = {
      username, 
      status: true
    };
    const docs = await Watchlist.find(query)
      .sort({ createdAt: 1 })
      .skip(page * limit)
      .limit(limit)
      .exec()
    const totalCount = await Watchlist.countDocuments(query)
    ctx.session.publicWatchlist.page = ++ctx.session.publicWatchlist.page
    console.log('docs totalCount', totalCount)
    return {
      total: totalCount,
      page, 
      limit,
      docs,
    }
  } catch (error) {
    console.log(error)
  }
}

async function sendMessage(ctx, films) {
  try {
    const parsed = parserToHTML(films.docs)
    for (let i = 0; i < parsed.length; i++) {
      const film = parsed[i];
      if ((films.page + 1) * films.limit > films.total) {
        buttons = [
          [
            Markup.button.callback(`Трейлер`, `${film.title}`), 
            Markup.button.callback(`Добавить в список`, `wl_${film.filmId}`), 
          ]
        ]
      } else {
        if (films.docs.length === i + 1) {
          buttons = [
            [
              Markup.button.callback(`Трейлер`, `${film.title}`), 
            Markup.button.callback(`Добавить в список`, `wl_${film.filmId}`), 
            ],
            [
              Markup.button.callback(`Еще`, `more`), 
            ]
          ]
        } else {
          buttons = [
            [
              Markup.button.callback(`Трейлер`, `${film.title}`), 
            Markup.button.callback(`Добавить в список`, `wl_${film.filmId}`), 
            ]
          ]
        }
      }


      await ctx.replyWithPhoto({url: film.poster}, { caption: film.html, parse_mode: 'HTML',
      ...Markup.inlineKeyboard(
        buttons
      )
    })
    }
  } catch (error) {
    console.log('error sendMessage', error)
  }
}


module.exports = publicWatchlistScene
