const { Scenes } = require('telegraf');
const axios = require('axios');
require('dotenv').config()
const trailer = require('../utils/functions/getTrailer')
const { commandHandler } = require('../handler/commandHandler')
const addToWatchlist = require('../utils/functions/addToWatchlist');
const sendMovies = require('../utils/functions/sendMovies')
const skeleton = require('../utils/skeleton/skeleton');
const getLink = require('../utils/functions/getLink')
const filterMenu = require('../button/filterMenu');
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

searchByFilter.command('genre', async (ctx) => {
  ctx.scene.enter('searchByFilterScene')
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

// more movies
searchByFilter.action('more' , async (ctx) => {
  try {
    await ctx.answerCbQuery()
    ctx.session.genre.page = ++ctx.session.genre.page
    const movies = await getMoviesByGenre(ctx)
    const parsedData = skeleton(movies)
    await sendMovies(ctx, parsedData)
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

// если начинается с link_
searchByFilter.action(/(link_.+)/, async (ctx) => {
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

searchByFilter.action(/^\d+$/ , async (ctx) => {
  try {
    await ctx.answerCbQuery()
    const genreId = ctx.match[0]
    ctx.session.genre.genreId = genreId
    const movies = await getMoviesByGenre(ctx)
    const parsedData = skeleton(movies)
    await sendMovies(ctx, parsedData)
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
    // console.log('data====>', data)
    ctx.session.genre.totalPages = data.totalPages
    return {
      page: page,
      count: data.items.length,
      total: data.total,
      docs: data.items
    }

  } catch (error){
    console.log(error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
}

module.exports = searchByFilter
