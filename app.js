const { Telegraf, Markup, Scenes, session } = require('telegraf')
const logger = require('./utils/logger');
const i18n = require('./i18n.config')
var cron = require('node-cron');
const mongoose = require('mongoose');
require('dotenv').config()

//scenes 
const searchCinemaScene = require('./scene/searchCinema')
const topScene = require('./scene/top')
const popularScene = require('./scene/popular')
const languageScene = require('./scene/language')
const searchByFilterScene = require('./scene/searchByFilters')
const watchlistScene = require('./scene/watchlist')

const { kinopoiskGetMoviesByType } = require('./utils/functions/kinopoisk')
const { imdbGetMoviesByType } = require('./utils/functions/imdb')


// buttons
const helpButton = require('./button/help');
const menuButton = require('./button/menu');
const langButton = require('./button/lang');
const getGenres = require('./getGenres');


const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Scenes.Stage([
	languageScene,
	searchCinemaScene,
	topScene,
	popularScene,
	searchByFilterScene,
	watchlistScene,
]);

// Важно следить за порядком обявления мидлваров 
// подробней https://github.com/telegraf/telegraf-i18n/issues/44
bot.use(session())
bot.use(i18n.middleware())
bot.use(stage.middleware())

bot.use(Telegraf.log())

bot.telegram.setMyCommands([
  {command: 'help', description: 'Помощь'},
  {command: 'start', description: 'Приветствие'},
  {command: 'watchlist', description: 'Мой список'},
  {command: 'lang', description: 'Язык'},
  {command: 'menu', description: 'Меню Поиска'},
  {command: 'search', description: 'Поиска фильма'},
  {command: 'top', description: 'Top фильмов'},
  {command: 'popular', description: 'Популярные фильмы'},
])
bot.start(async (ctx) => {
  try {
    await ctx.reply(`${ctx.i18n.t('hello')} ${ctx.update.message.from.first_name} 🥰 ${ctx.i18n.t('i_know_about_movie')} 🙃`)
    await ctx.reply(`${ctx.i18n.t('you_want')} /help`)
    // getGenres()
    // await ctx.scene.enter('searchByFilterScene')
    return ctx.scene.enter('languageScene')
  } catch (error) { 
    console.log('error', error)
  }
})

bot.on('text', (ctx) => {
  logger(ctx)
})

cron.schedule('0 0 0 * * *', async () => {
  await imdbGetMoviesByType('top')
  await imdbGetMoviesByType('popular')
});

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(async () => {
    console.log('MongoDb connected...')
    await bot.launch()
    console.log('TG Bot launched...')
  })
  .catch( error => console.error(error))


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))





