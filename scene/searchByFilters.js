const { Scenes, Markup, Telegraf } = require('telegraf');
const axios = require('axios');
const filterMenu = require('../button/filterMenu');
require('dotenv').config()
const toHtml = require('../utils/parser/moviesByGenreHTML');
const parseDataToWatchlist = require('../utils/parseDataToWatchlist');
const Watchlist = require('../model/watchlist')
const trailer = require('../getTrailer')
const { commandHandler } = require('../handler/commandHandler')


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


searchByFilter.help(async (ctx) => {
  helpButton(ctx)
})

searchByFilter.command('menu', async (ctx) => {
  menuButton(ctx)
})

searchByFilter.command('lang', async (ctx) => {
  ctx.scene.enter('languageScene')
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

searchByFilter.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
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
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
  }
})

// add to watchlist
searchByFilter.action(/(wl_.+)/, async (ctx) => {
  try {
    await ctx.answerCbQuery()
    const match = ctx.match[0]
    const userId = ctx.update.callback_query.from.id
    const filmId = match.slice(3)
    let parsedData
    const hasMovie = await Watchlist.findOne({film_id: filmId})
    if (hasMovie) {
      if (hasMovie.status) {
        return await ctx.reply(`${ctx.i18n.t('successfully')}`)
      } else if(!hasMovie.status){
        const hasMovie = await Watchlist.findOneAndUpdate({film_id: filmId}, {status: true})
        return await ctx.reply(`${hasMovie.title} ${ctx.i18n.t('successfully')}`)
      }
    } else {
      if (filmId[0] === 't') {
        const { data } = await axios.get(`http://www.omdbapi.com/?i=${filmId}&apikey=${process.env.API_KEY_OMDB}`)
        parsedData = parseDataToWatchlist(data, 'omdbapi')
      } else {
        const options = {
          method: 'GET',
          headers: {
            'X-API-KEY': process.env.API_KEY_KINOPOISK,
            'Content-Type': 'application/json',
          },
          url: `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`
        };
        const foundFilms = await axios(options)
        parsedData = parseDataToWatchlist(foundFilms.data, 'kinopoiskapiunofficial')
      }
      const saveResult = await Watchlist.create({...parsedData, tg_id: userId})
      if (saveResult) {
        return ctx.reply(`${parsedData.title} ${ctx.i18n.t('successfully')}`)
      }
    }

    // if (!hasMovie) {
    //   if (filmId[0] === 't') {
    //     const { data } = await axios.get(`http://www.omdbapi.com/?i=${filmId}&apikey=${process.env.API_KEY_OMDB}`)
    //     parsedData = parseDataToWatchlist(data, 'omdbapi')
    //   } else {
    //     const options = {
    //       method: 'GET',
    //       headers: {
    //         'X-API-KEY': process.env.API_KEY_KINOPOISK,
    //         'Content-Type': 'application/json',
    //       },
    //       url: `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`
    //     };
    //     const foundFilms = await axios(options)
    //     parsedData = parseDataToWatchlist(foundFilms.data, 'kinopoiskapiunofficial')
    //   }
    //   const saveResult = await Watchlist.create({...parsedData, tg_id: userId})
    //   if (saveResult) {
    //     return ctx.reply(`${parsedData.title} ${ctx.i18n.t('successfully')}`)
    //   }
    // } else {
    //   return ctx.reply(`${ctx.i18n.t('successfully')}`)
    // }

  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
  }
})


// more movies
searchByFilter.action(/(id_.+)/, async (ctx) => {
  try {
    ctx.session.genre.page++
    getMoviesByGenre(ctx)
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
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
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
  }
})
async function getMoviesByGenre(ctx) {
  try {
    const page = ctx.session.genre.page
    const genreId = ctx.session.genre.genreId
    console.log('GENRE ===>', ctx.session.genre)
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
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
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
            Markup.button.callback(`${ctx.i18n.t('trailer')}`, `${movie.title}`), 
            Markup.button.callback(`${ctx.i18n.t('add_watchlist')}`, `wl_${movie.film_id}`), 
          ],
          [
            Markup.button.callback(`${ctx.i18n.t('more')}`, `id_${movie.film_id}`), 
          ]
        ]
      } else {
        buttons = [
          [
            Markup.button.callback(`${ctx.i18n.t('trailer')}`, `${movie.title}`), 
            Markup.button.callback(`${ctx.i18n.t('add_watchlist')}`, `wl_${movie.film_id}`), 
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
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
  }
}

module.exports = searchByFilter

// https://kinopoiskapiunofficial.tech/api/v2.2/films?genres=1&genres=4&genres=0&order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1'
// https://kinopoiskapiunofficial.tech/api/v2.2/films?genres=1&order=RATING&type=FILM&ratingFrom=7&ratingTo=10&yearFrom=1000&yearTo=3000&page=1