const { Telegraf, Scenes, session } = require('telegraf')
const logger = require('./utils/logger');
const mongoose = require('mongoose');
require('dotenv').config()
const axios = require('axios')

//scenes 
const searchCinemaScene = require('./scene/searchCinema')
const topScene = require('./scene/top')
const popularScene = require('./scene/popular')
const searchByFilterScene = require('./scene/searchByFilters')
const watchlistScene = require('./scene/watchlist')
const settingsScene = require('./scene/settings')
const publicWatchlistScene = require('./scene/publicWatchlist')

const menuButton = require('./button/menu');
const { commandHandler } = require('./handler/commandHandler');
const PublicWatchlist = require('./model/publicWatchlist');


const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Scenes.Stage([
	searchCinemaScene,
	topScene,
	popularScene,
	searchByFilterScene,
	watchlistScene,
	settingsScene,
	publicWatchlistScene,
]);

// Важно следить за порядком обявления мидлваров 
// подробней https://github.com/telegraf/telegraf-i18n/issues/44
bot.use(session())
bot.use(stage.middleware())

bot.use(Telegraf.log())

bot.telegram.setMyCommands([
  {command: 'help', description: 'Помощь'},
  {command: 'start', description: 'Приветствие'},
  {command: 'watchlist', description: 'Плейлист'},
  {command: 'genre', description: 'Лучшие фильмы по жанрам'},
  {command: 'publicwl', description: 'Публичные плейлисы'},
  {command: 'menu', description: 'Меню Поиска'},
  {command: 'search', description: 'Поиска фильма'},
  {command: 'top', description: 'Top фильмы'},
  {command: 'popular', description: 'Популярные фильмы'},
  {command: 'settings', description: 'Настройки'},
])
bot.start(async (ctx) => {
  try {
    await ctx.reply(`Привет ${ctx.update.message.from.first_name} 🥰 Я знаю много информацию о фильмах 🙃`)
    await ctx.reply(`Хочешь найти информацию о фильме? /help`)
    menuButton(ctx)
  } catch (error) { 
    console.log('error', error)
  }
})

bot.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
  }
})  




mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(async () => {
  console.log('MongoDb connected...')
  await bot.launch()
  console.log('TG Bot launched...')
}).catch( error => console.error(error))




// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))





