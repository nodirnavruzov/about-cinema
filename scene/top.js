const { Scenes, Markup } = require('telegraf');
const { commandHandler } = require('../handler/commandHandler');
const helpButton = require('../button/help')
const countButton = require('../button/count');
const menuButton = require('../button/menu');
const Imdb250 = require('../model/imdb250')
const KpBest250 = require('../model/kpBest250')
const skeletonTop = require('../utils/skeleton/skeletonTop');
const addToWatchlist = require('../utils/functions/addToWatchlist');
const trailer = require('../utils/functions/getTrailer')


const topScene = new Scenes.BaseScene('topScene')

topScene.enter(async (ctx) => {
  return await ctx.reply('Выберите платформу', Markup
  .keyboard([
    ['Кинопоиск', 'IMDB'],
  ]).oneTime().resize())  
})

topScene.start(async (ctx) => {
  try {
    await ctx.reply(`Привет ${ctx.update.message.from.first_name} 🥰 Я знаю много информацию о фильмах 🙃`)
    await ctx.reply(`Хочешь найти информацию о фильме? /help`)
  } catch (error) {
    console.log('error', error)
  }
})

topScene.help(async (ctx) => {
  helpButton(ctx)
})

topScene.command('menu', async (ctx) => {
  menuButton(ctx)
})

topScene.command('search', async (ctx) => {
  ctx.scene.enter('searchCinemaScene')
})

topScene.command('top', async (ctx) => {
  ctx.scene.enter('topScene')
})

topScene.command('popular', async (ctx) => {
  ctx.scene.enter('popularScene')
})

topScene.command('watchlist', async (ctx) => {
  ctx.scene.enter('watchlistScene')
})



topScene.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
  }
})  


topScene.action('more' , async (ctx) => {
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

// если начинается с wl_
topScene.action(/(wl_.+)/, async (ctx) => {
  try {
    await addToWatchlist(ctx)
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

// если не начинается с id_
topScene.action(/^(?!id_).*$/, async (ctx) => {
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


topScene.on('text', async (ctx, next) => {
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


async function getMovies(ctx) {
  try {
    const {imdb, kp} = ctx.session.top
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





module.exports = topScene
