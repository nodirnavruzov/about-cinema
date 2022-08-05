const { Scenes, Markup, Telegraf } = require('telegraf');
const axios = require('axios')
const trailer = require('../utils/functions/getTrailer')
const { commandHandler } = require('../handler/commandHandler')
const helpButton = require('../button/help')
const menuButton = require('../button/menu');
require('dotenv').config()
const addToWatchlist = require('../utils/functions/addToWatchlist');
const searchedMovie = require("../model/searchedMovie");
const skeleton = require('../utils/skeleton/skeleton');
const getLink = require('../utils/functions/getLink')


const searchCinemaScene = new Scenes.BaseScene('searchCinemaScene')

searchCinemaScene.enter(async (ctx) => {
  try {
    ctx.reply(`Введи название фильма.\nНа пример Супермен`)
    return searchCinemaScene
  } catch (error) {
    console.log('error', error)
  }
})

searchCinemaScene.start(async (ctx) => {
  try {
    await ctx.reply(`Привет ${ctx.update.message.from.first_name} 🥰 Я знаю много информацию о фильмах 🙃`)
    await ctx.reply(`Хочешь найти информацию о фильме? /help`)
  } catch (error) {
    console.log('error', error)
  }
})

searchCinemaScene.help(async (ctx) => {
  helpButton(ctx)
})

searchCinemaScene.command('menu', async (ctx) => {
  menuButton(ctx)
})

searchCinemaScene.command('search', async (ctx) => {
  ctx.scene.enter('searchCinemaScene')
})

searchCinemaScene.command('top', async (ctx) => {
  ctx.scene.enter('topScene')
})

searchCinemaScene.command('popular', async (ctx) => {
  ctx.scene.enter('popularScene')
})

searchCinemaScene.command('watchlist', async (ctx) => {
  ctx.scene.enter('watchlistScene')
})

searchCinemaScene.command('publicwl', async (ctx) => {
  ctx.scene.enter('publicWatchlistScene')
})

searchCinemaScene.command('settings', async (ctx) => {
  ctx.scene.enter('settingsScene')
})

searchCinemaScene.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
  }
})

searchCinemaScene.on('text', async (ctx) => {
  try {
    ctx.reply(`Круто! Я Пошел искать, быстро вернусь☺️`)
    const text = ctx.update.message.text
    let result
    if (/[а-яё]/i.test(text)) {
      // ru
      result = await filmsByRuCharacters(ctx, text)
    } else {
      // eng
      result = await filmsByEnCharacters(ctx, text)
    }
    await sendMessage(ctx, result)

  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

// если начинается с wl_
searchCinemaScene.action(/(wl_.+)/, async (ctx) => {
  try {
    await addToWatchlist(ctx)
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

searchCinemaScene.action(/(link_.+)/, async (ctx) => {
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

// если не начинается с id_
searchCinemaScene.action(/^(?!id_).*$/, async (ctx) => {
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

async function sendMessage(ctx, movies) {
  try {
    console.log('movies', movies.docs)
    for (let i = 0; i < movies.docs.length; i++) {
      const movie = movies.docs[i];
      if (movie.title && movie.title.length > 21) {
        movie.title = movie.title.slice(0, 21)
      }
      await ctx.replyWithPhoto({url: movie.poster}, { caption: movie.html, parse_mode: 'HTML',
        ...Markup.inlineKeyboard(
          [
            [
              Markup.button.callback(`Трейлер`, `${movie.title}_${movie.year}`), 
              Markup.button.callback(`Добавить в список`, `wl_${movie.filmId}`), 
            ],
            [
              Markup.button.callback(`Смотреть`, `link_${movie.filmId}`), 
            ]
          ]
        )
      })
  }

  } catch (error) {
    console.log('error sendMessage', error)
  }
}

async function filmsByEnCharacters (ctx, name) {
  try {
  const username = ctx.update.message.from.username
  const userId = ctx.update.message.from.id
  let moviesObj
    const { data } = await axios.get(`http://www.omdbapi.com/?s=${name}&type=movie&apikey=${process.env.API_KEY_OMDB}`)
    if (data.Response !== 'False') {
      const foundFilms = data.Search
      moviesObj = {
        page:  1,
        count: data.Search.length,
        total: data.Search.length,
        docs: []
      }
      for (film of foundFilms) {
        const options = {
          method: 'GET',
          headers: {
            'X-API-KEY': process.env.API_KEY_KINOPOISK,
            'Content-Type': 'application/json',
          },
          url: `https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&imdbId=${film.imdbID}&page=1`
        };
        let result = await axios(options)
        result = result.data.items[0]
        if (result) { 
          if (result.nameRu) {
            moviesObj.docs.push(result)
            await searchedMovie.create({...result, tg_id: userId, username, keyword: name})
          }
        }
      } 
      return skeleton(moviesObj)
    } else {
      return ctx.reply(`Фильмы с названием *${name}* не найденно! 😔` )
    }
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }


}
async function filmsByRuCharacters (ctx, name) {
  const username = ctx.update.message.from.username
  const userId = ctx.update.message.from.id
  let moviesObj = {}
  try {
    const options = {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.API_KEY_KINOPOISK,
        'Content-Type': 'application/json',
      },
      url: `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(name)}`
    };
    const foundFilms = await axios(options)
    const foundByName = foundFilms.data
    moviesObj = {
      page: foundByName.pagesCount,
      count: foundByName.films.length,
      total: foundByName.searchFilmsCountResult,
      docs: []
    }

    if (foundByName.searchFilmsCountResult) {
      for (const film of foundByName.films) {
        const options = {
          method: 'GET',
          headers: {
            'X-API-KEY': process.env.API_KEY_KINOPOISK,
            'Content-Type': 'application/json',
          },
          url: `https://kinopoiskapiunofficial.tech/api/v2.2/films/${film.filmId}`
        };
        let result = await axios(options)
        result = result.data
        moviesObj.docs.push(result)
        // need optimization
        await searchedMovie.create({...result, tg_id: userId, username, keyword: name})
      }
      return skeleton(moviesObj)
    }  else {
      return ctx.reply(`Фильмы с названием *${name}* не найденно! 😔` )
    }
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
}

module.exports = searchCinemaScene