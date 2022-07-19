const { Scenes, Markup } = require('telegraf');
const { commandHandler } = require('../handler/commandHandler');

const enTop = require('./top');
const ruTop = require('./searchCinema');

const helpButton = require('../button/help')
const countButton = require('../button/count');
const menuButton = require('../button/menu');
const langButton = require('../button/lang');

// const i18n = require('../i18n.config')

const languageScene = new Scenes.BaseScene('languageScene')


languageScene.enter(async (ctx) => {
  langButton(ctx)
  return languageScene 
})

languageScene.help(async (ctx) => {
  helpButton(ctx)
})

languageScene.command('lang', async (ctx) => {
  ctx.scene.enter('languageScene')
})

languageScene.command('menu', async (ctx) => {
  menuButton(ctx)
})

languageScene.command('search', async (ctx) => {
  ctx.scene.enter('searchCinemaScene')
})

languageScene.command('top', async (ctx) => {
  ctx.scene.enter('topScene')
})

languageScene.command('popular', async (ctx) => {
  ctx.scene.enter('popularScene')
})

languageScene.command('watchlist', async (ctx) => {
  ctx.scene.enter('watchlistScene')
})

languageScene.on('text', (ctx, next) => {
  let lang = ctx.update.message.text
  lang = lang.split(' ')[0]
  lang = lang.toLowerCase()
  if (lang === 'en 🇺🇸' || lang === 'en') {
    ctx.scene.state.lang = lang
    ctx.i18n.locale(lang)
      
    menuButton(ctx)

  } else if (lang === 'ru 🇷🇺' || lang === 'ru') {
    ctx.scene.state.lang = lang
    ctx.i18n.locale(lang)
    menuButton(ctx)
  } else {
    commandHandler(ctx, next)
  }
})





module.exports = languageScene
