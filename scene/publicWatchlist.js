const { Scenes, Markup, Telegraf } = require('telegraf');
const PublicWatchlist = require('../model/publicWatchlist');
const Watchlist = require('../model/watchlist');
const addToWatchlist = require('../utils/functions/addToWatchlist');
const trailer = require('../utils/functions/getTrailer')
const menuButton = require('../button/menu');
const helpButton = require('../button/help')
const { commandHandler } = require('../handler/commandHandler');
const sendMovies = require('../utils/functions/sendMovies')
const skeleton = require('../utils/skeleton/skeleton');
const getLink = require('../utils/functions/getLink')



const publicWatchlistScene = new Scenes.BaseScene('publicWatchlistScene')

publicWatchlistScene.enter(async (ctx) => {
  try {
    const myId = ctx.update.message.from.id
    ctx.session.publicWatchlist = {
      page: 0,
      limit: 5,
      wluser: ''
    }
    const users = await PublicWatchlist.find({ status: {$eq: true} } , 'username tg_id').exec()
    if (users.length) {
      const list = await createList(users)
      const html = createHTML(list)
      await sendList(ctx, html)
    } else {
      await ctx.replyWithHTML('Пока никто не сделал свой плейлист публичным!\nБудьте первым зайдите в <b>НАСТРОЙКИ > ПЛЕЙЛИСТ > СДЕЛАТЬ ПУБЛИЧНЫМ</b>')
    }

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

publicWatchlistScene.command('genre', async (ctx) => {
  ctx.scene.enter('searchByFilterScene')
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

publicWatchlistScene.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
  }
})  

publicWatchlistScene.action('more' , async (ctx) => {
  try {
    await ctx.answerCbQuery()
    let username = ctx.session.publicWatchlist.wluser
    const movies = await getMovies(ctx, username)
    const creatoedSkeleton = skeleton(movies)
    await sendMovies(ctx, creatoedSkeleton)
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

publicWatchlistScene.action(/(link_.+)/, async (ctx) => {
  try {
    await ctx.answerCbQuery()
    await ctx.reply('Ссылка подготавливается ⏳')
    const match = ctx.match[0]
    const filmId = match.split('_')[1]
    const result = await getLink(filmId)
    await ctx.reply(result.link)
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})


publicWatchlistScene.action(/^(?!id_).*$/, async (ctx) => {
  try {
    const filmTitle = ctx.match[0].split('_')
    const url = await trailer(...filmTitle)
    await ctx.reply(url) 
    await ctx.answerCbQuery()
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
    const creatoedSkeleton = skeleton(movies)
    await sendMovies(ctx, creatoedSkeleton)
  } catch (error) {
    console.log(error)    
  }
})

async function createList(data) {
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
  let html
  for (let i = 0; i < data.length; i++) {
    const user = data[i]
    if (html) {
      html +=`● <b>/${user.user.username} Фильмов: ${user.total}</b>`
    } else {
      html =`● <b>/${user.user.username} Фильмов: ${user.total}</b>`
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

module.exports = publicWatchlistScene
