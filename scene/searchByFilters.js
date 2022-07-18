const { Scenes, Markup, Telegraf } = require('telegraf');
const countButton = require('../button/count');
const helpButton = require('../button/help')
const menuButton = require('../button/menu');
const kinopoiskPopularMovies  = require('../movies/kinopoisk/popular.json')
const imdbPopularMovies  = require('../movies/imdb/popular.json')
const { apiKey_imdb_api, apiKey_kinopoisk_api } = require('../config/keys')
const { commandHandler } = require('../handler/commandHandler');
const axios = require('axios');
const filterMenu = require('../button/filterMenu');



const searchByFilter = new Scenes.BaseScene('searchByFilterScene')
const genreScene = new Scenes.BaseScene('genreScene')
const rateingScene = new Scenes.BaseScene('rateingScene')

searchByFilter.enter(async (ctx) => {
  await filterMenu(ctx)
  return searchByFilter 
})

searchByFilter.action(/^\d+$/ , async (ctx) => {
  try {
    await ctx.answerCbQuery()
    const genreId = ctx.match[0]
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
  }
})



module.exports = searchByFilter







// https://kinopoiskapiunofficial.tech/api/v2.2/films?genres=1&order=RATING&type=FILM&ratingFrom=7&ratingTo=10&yearFrom=1000&yearTo=3000&page=1