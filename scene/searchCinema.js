const { Scenes, Markup, Telegraf } = require('telegraf');
const axios = require('axios')
const { createSkeleton } = require('../utils/skeleton/skeleton')
const trailer = require('../utils/functions/getTrailer')
const { commandHandler } = require('../handler/commandHandler')
const helpButton = require('../button/help')
const menuButton = require('../button/menu');
const Watchlist = require('../model/watchlist');
require('dotenv').config()
const addToWatchlist = require('../utils/functions/addToWatchlist');
const searchedMovie = require("../model/searchedMovie");


const searchCinemaScene = new Scenes.BaseScene('searchCinemaScene')

searchCinemaScene.enter(async (ctx) => {
  try {
    ctx.reply(`Введи название фильма`)
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
    for (let i = 0; i < result.length; i++) {
      const elem = result[i];
      await sendMessage(ctx, elem)
    }
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

async function sendMessage(ctx, elem) {
  console.log('elem', elem)
  try {
    if (elem.title && elem.title.length > 21) {
      elem.title = elem.title.slice(0, 21)
    }
    return await ctx.replyWithPhoto({url: elem.poster}, { caption: elem.html, parse_mode: 'HTML',
    ...Markup.inlineKeyboard(
      [
        [
            Markup.button.callback(`Трейлер`, `${elem.title}`), 
            Markup.button.callback(`Добавить в список`, `wl_${elem.filmId}`), 
        ]
      ]
    )})
  } catch (error) {
    console.log('error sendMessage', error)
  }
}

async function filmsByEnCharacters (ctx, name) {
  try {
  const username = ctx.update.message.from.username
  const userId = ctx.update.message.from.id
    
    const { data } = await axios.get(`http://www.omdbapi.com/?s=${name}&type=movie&apikey=${process.env.API_KEY_OMDB}`)
    if (data.Response !== 'False') {
      const foundFilms = data.Search
      const arrayFilms = []
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
          if (result.nameRu || result.nameOriginal) {
            arrayFilms.push(result)
            await searchedMovie.create({...result, tg_id: userId, username, keyword: name})
          }
        }
      } 
      return createSkeleton(arrayFilms)
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
  let arrayRuMovies = []
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
    if (foundByName.searchFilmsCountResult) {
      const arrayFilms = []
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
        arrayRuMovies.push(result)
        // need optimization
        await searchedMovie.create({...result, tg_id: userId, username, keyword: name})
      }
      return createSkeleton(arrayRuMovies)
    }  else {
      return ctx.reply(`Фильмы с названием *${name}* не найденно! 😔` )
    }
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
}

module.exports = searchCinemaScene