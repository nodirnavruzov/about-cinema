const { Scenes, Markup, Telegraf } = require('telegraf');
const countButton = require('../button/count');
const helpButton = require('../button/help')
const menuButton = require('../button/menu');
const { commandHandler } = require('../handler/commandHandler');
const axios = require('axios')
const mongoose = require('mongoose')
const Imdb250 = require('../model/imdb250');
const ImdbPopular = require('../model/imdbPopular');
const KpBest250 = require('../model/kpBest250');
const KpPopular100 = require('../model/kpPopular100');
const skeletonTop = require('../utils/skeleton/skeletonTop');
const Watchlist = require('../model/watchlist');
const addToWatchlist = require('../utils/functions/addToWatchlist');
const trailer = require('../utils/functions/getTrailer')


const popularScene = new Scenes.BaseScene('popularScene')
//finishg all
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
      const htmlFilms = skeletonTop(movies, ctx)
      await sendMovies(htmlFilms, ctx)    
    }
    
  } else if (platform === 'imdb' ) {
    ctx.session.top.imdb.state = true
    ctx.session.top.kp.state = false 
    const movies = await getMovies(ctx)
    if (movies) {
      const htmlFilms = skeletonTop(movies, ctx)
      await sendMovies(htmlFilms, ctx)    
    }
  } else {
    commandHandler(ctx, next)
  }
})


// если начинается с wl_
popularScene.action(/(wl_.+)/, async (ctx) => {
  try {
    await addToWatchlist(ctx)
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

// если more
popularScene.action('more' , async (ctx) => {
  try {
    await ctx.answerCbQuery()
    const movies = await getMovies(ctx)
    const htmlFilms = skeletonTop(movies, ctx)
    sendMovies(htmlFilms, ctx)
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

// если не начинается с id_
popularScene.action(/^(?!id_).*$/, async (ctx) => {
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



async function getMovies(ctx) {
  try {
    const {imdb, kp} = ctx.session.top
    // let { page, limit } = ctx.session.top.kp
    if (kp.state) {
      let count = +kp.limit  
      let limit = +kp.limit  
      let page = +kp.page  
      var query = {};
      const docs = await KpBest250.find(query)
        .sort({ createdAt: 1 })
        .skip(page * limit)
        .limit(limit)
        .exec()
      const totalCount = await KpBest250.estimatedDocumentCount(query)
      if ((page + 1) * limit > totalCount) {
        console.log('tugadi')
      }
      ctx.session.top.kp.page = ++ctx.session.top.kp.page
      return {
        total: totalCount,
        page, 
        count,
        docs,
      }
    } else {
      let count = +imdb.limit  
      let limit = +kp.limit  
      let page = +imdb.page  
      var query = {};
      const docs = await Imdb250.find(query)
        .sort({ createdAt: 1 })
        .skip(page * limit)
        .limit(limit)
        .exec()
      const totalCount = await Imdb250.estimatedDocumentCount(query)
      if ((page + 1) * limit > totalCount) {
        console.log('tugadi')
      }
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

async function sendMovies(movies, ctx) {
  for (let i = 0; i < movies.docs.length; i++) {
    const movie = movies.docs[i];
    let buttons = [] 
    if (movie.title && movie.title.length > 21) {
      movie.title = movie.title.slice(0, 21)
    }
    if (movies.docs.length === i + 1) {
      buttons = [
        [
          Markup.button.callback(`Трейлер`, `${movie.title}`), 
          Markup.button.callback(`Добавить в список`, `wl_${movie.filmId}`), 
        ],
        [
          Markup.button.callback(`Еще`, `more`), 
        ]
      ]
    } else {
      buttons = [
        [
          Markup.button.callback(`Трейлер`, `${movie.title}`), 
          Markup.button.callback(`Добавить в список`, `wl_${movie.filmId}`), 
        ]
      ]
    }

    await ctx.replyWithPhoto({url: movie.poster}, { caption: movie.html, parse_mode: 'HTML',
      ...Markup.inlineKeyboard(
        buttons
      )
    })
  }
}




module.exports = popularScene
