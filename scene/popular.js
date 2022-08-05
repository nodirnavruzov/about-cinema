const { Scenes, Markup, Telegraf } = require('telegraf');
const helpButton = require('../button/help')
const menuButton = require('../button/menu');
const { commandHandler } = require('../handler/commandHandler');
const Imdb250 = require('../model/imdb250');
const KpBest250 = require('../model/kpBest250');
const skeleton = require('../utils/skeleton/skeleton');
const addToWatchlist = require('../utils/functions/addToWatchlist');
const trailer = require('../utils/functions/getTrailer')
const getLink = require('../utils/functions/getLink')
const sendMovies = require('../utils/functions/sendMovies')


const popularScene = new Scenes.BaseScene('popularScene')

popularScene.enter(async (ctx) => {
  return await ctx.reply('Выберите платформу', Markup
  .keyboard([
    ['Кинопоиск', 'IMDB'],
  ]).oneTime().resize())  
})

popularScene.start(async (ctx) => {
  try {
    await ctx.reply(`Привет ${ctx.update.message.from.first_name} 🥰 Я знаю много информацию о фильмах 🙃`)
    await ctx.reply(`Хочешь найти информацию о фильме? /help`)
  } catch (error) {
    console.log('error', error)
  }
})

popularScene.help(async (ctx) => {
  helpButton(ctx)
})

popularScene.command('menu', async (ctx) => {
  menuButton(ctx)
})

popularScene.command('search', async (ctx) => {
  ctx.scene.enter('searchCinemaScene')
})

popularScene.command('top', async (ctx) => {
  ctx.scene.enter('topScene')
})

popularScene.command('popular', async (ctx) => {
  ctx.scene.enter('popularScene')
})

popularScene.command('watchlist', async (ctx) => {
  ctx.scene.enter('watchlistScene')
})

popularScene.command('publicwl', async (ctx) => {
  ctx.scene.enter('publicWatchlistScene')
})

popularScene.command('settings', async (ctx) => {
  ctx.scene.enter('settingsScene')
})

popularScene.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
  }
})  

popularScene.on('text', async (ctx, next) => {
  let platform = ctx.update.message.text
  platform = platform.split(' ')[0]
  platform = platform.toLowerCase()
  ctx.session.top = {
    kp: {
      page: 0,
      limit: 5,
      state: false
    },
    imdb: {
      page: 0,
      limit: 5,
      state: false
    },
  }
  if (platform === 'кинопоиск') {
    ctx.session.top.kp.state = true
    ctx.session.top.imdb.state = false
    const movies = await getMovies(ctx)
    if (movies) {
      const htmlFilms = skeleton(movies, ctx)
      await sendMovies(ctx, htmlFilms)    
    }
    
  } else if (platform === 'imdb' ) {
    ctx.session.top.imdb.state = true
    ctx.session.top.kp.state = false 
    const movies = await getMovies(ctx)
    if (movies) {
      const htmlFilms = skeleton(movies, ctx)
      await sendMovies(ctx, htmlFilms)    
    }
  } else {
    commandHandler(ctx, next)
  }
})

// если начинается с link_
popularScene.action(/(link_.+)/, async (ctx) => {
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

// если начинается с wl_
popularScene.action(/(wl_.+)/, async (ctx) => {
  try {
    await ctx.answerCbQuery()
    await addToWatchlist(ctx)
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

// если more
popularScene.action('more', async (ctx) => {
  try {
    await ctx.answerCbQuery()
    const movies = await getMovies(ctx)
    // console.log('getMovies', movies)
    const htmlFilms = skeleton(movies)
    // console.log('htmlFilms', htmlFilms)
    await sendMovies(ctx, htmlFilms)
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

// если не начинается с id_
popularScene.action(/^(?!id_).*$/, async (ctx) => {
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

async function getMovies(ctx) {
  try {
    const { imdb, kp } = ctx.session.top
    if (kp.state) {
      let count = +kp.limit  
      let page = +kp.page  
      var query = {};
      const docs = await KpBest250.find(query)
        .sort({ createdAt: 1 })
        .skip(page * count)
        .limit(count)
        .exec()
      const totalCount = await KpBest250.estimatedDocumentCount(query)
      ctx.session.top.kp.page = ++ctx.session.top.kp.page
      return {
        total: totalCount,
        page, 
        count,
        docs,
      }
    } else {
      let count = +imdb.limit  
      let page = +imdb.page  


      var query = {};
      const docs = await Imdb250.find(query)
        .sort({ createdAt: 1 })
        .skip(page * count)
        .limit(count)
        .exec()
      const totalCount = await Imdb250.estimatedDocumentCount(query)
      ctx.session.top.imdb.page = ++ctx.session.top.imdb.page
      return {
        total: totalCount,
        page, 
        count,
        docs,
      }
    }
  } catch(error) {
    console.log(error)
  }
}

module.exports = popularScene
