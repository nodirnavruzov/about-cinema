const { Scenes, Markup, Telegraf } = require('telegraf');
const axios = require('axios');
const filterMenu = require('../button/filterMenu');
require('dotenv').config()
const toHtml = require('../utils/skeleton/moviesByGenreHTML');
const Watchlist = require('../model/watchlist')
const trailer = require('../utils/functions/getTrailer')
const { commandHandler } = require('../handler/commandHandler')
const addToWatchlist = require('../utils/functions/addToWatchlist');


const helpButton = require('../button/help')
const menuButton = require('../button/menu');




const searchByFilter = new Scenes.BaseScene('searchByFilterScene')

searchByFilter.enter(async (ctx) => {
  await filterMenu(ctx)
  ctx.session.genre = {
    page: 1,
    genreId: null,
    totalPages: 0
  }
  return searchByFilter 
})

searchByFilter.start(async (ctx) => {
  try {
    await ctx.reply(`Привет ${ctx.update.message.from.first_name} 🥰 Я знаю много информацию о фильмах 🙃`)
    await ctx.reply(`Хочешь найти информацию о фильме? /help`)
  } catch (error) {
    console.log('error', error)
  }
})

searchByFilter.help(async (ctx) => {
  helpButton(ctx)
})

searchByFilter.command('menu', async (ctx) => {
  menuButton(ctx)
})

searchByFilter.command('search', async (ctx) => {
  ctx.scene.enter('searchCinemaScene')
})

searchByFilter.command('top', async (ctx) => {
  ctx.scene.enter('topScene')
})

searchByFilter.command('popular', async (ctx) => {
  ctx.scene.enter('popularScene')
})

searchByFilter.command('watchlist', async (ctx) => {
  ctx.scene.enter('watchlistScene')
})

searchByFilter.command('publicwl', async (ctx) => {
  ctx.scene.enter('publicWatchlistScene')
})

searchByFilter.command('settings', async (ctx) => {
  ctx.scene.enter('settingsScene')
})

searchByFilter.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
  }
})

searchByFilter.action('more' , async (ctx) => {
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

searchByFilter.action(/^\d+$/ , async (ctx) => {
  try {
    await ctx.answerCbQuery()
    const genreId = ctx.match[0]
    ctx.session.genre.genreId = genreId
    await getMoviesByGenre(ctx)
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

// add to watchlist
searchByFilter.action(/(wl_.+)/, async (ctx) => {
  try {
    await addToWatchlist(ctx)
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})


// more movies
searchByFilter.action(/(id_.+)/, async (ctx) => {
  try {
    ctx.session.genre.page++
    getMoviesByGenre(ctx)
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

// get trailer
searchByFilter.action(/^(?!wl_).*$/, async (ctx) => {
  try {
    const filmTitle = ctx.match[0]
    const url = await trailer(filmTitle)
    await ctx.answerCbQuery()
    ctx.reply(url) 
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})
async function getMoviesByGenre(ctx) {
  try {
    const page = ctx.session.genre.page
    const genreId = ctx.session.genre.genreId
    const options = {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.API_KEY_KINOPOISK,
        'Content-Type': 'application/json',
      },
      url: `https://kinopoiskapiunofficial.tech/api/v2.2/films?genres=${genreId}&order=RATING&type=FILM&ratingFrom=5&ratingTo=10&yearFrom=1000&yearTo=3000&page=${page}`
    };
    const { data } = await axios(options)
    const parsedData = toHtml(data.items)
    ctx.session.genre.totalPages = data.totalPages
    
    await sendMovies(ctx, parsedData)
  } catch (error){
    console.log(error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
}

async function sendMovies(ctx, movies) {
  try {
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      let buttons = [] 
      if (movie.title && movie.title.length > 21) {
        movie.title = movie.title.slice(0, 21)
      }
      if (movies.length === i + 1 && ctx.session.genre.totalPages !== ctx.session.genre.page) {
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

  } catch(error) {
    console.log(error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
}

module.exports = searchByFilter
