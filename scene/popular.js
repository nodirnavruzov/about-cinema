const { Scenes, Markup, Telegraf } = require('telegraf');
const countButton = require('../button/count');
const helpButton = require('../button/help')
const menuButton = require('../button/menu');
const kinopoiskPopularMovies  = require('../movies/kinopoisk/popular.json')
const imdbPopularMovies  = require('../movies/imdb/popular.json')
const { commandHandler } = require('../handler/commandHandler');
const axios = require('axios')



const popularScene = new Scenes.BaseScene('popularScene')

popularScene.enter(async (ctx) => {
  countButton(ctx)
  return popularScene 
})

popularScene.start(async (ctx) => {
  try {
    await ctx.reply(`${ctx.i18n.t('hello')} ${ctx.update.message.from.first_name} 🥰 ${ctx.i18n.t('i_know_about_movie')} 🙃`)
    await ctx.reply(`${ctx.i18n.t('you_want')} /help`)
  } catch (error) {
    console.log('error', error)
  }
})

popularScene.help(async (ctx) => {
  helpButton(ctx)
})

popularScene.command('menu', async (ctx) => {
  menuButton(ctx)
})

popularScene.command('lang', async (ctx) => {
  ctx.scene.enter('languageScene')
})

popularScene.command('search', async (ctx) => {
  ctx.scene.enter('searchCinemaScene')
})

popularScene.command('top', async (ctx) => {
  ctx.scene.enter('topScene')
})

popularScene.command('popular', async (ctx) => {
  ctx.scene.enter('popularScene')
})

popularScene.command('watchlist', async (ctx) => {
  ctx.scene.enter('watchlistScene')
})

popularScene.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
  }
})  

popularScene.on('text', async (ctx) => {
  const selectedLang = ctx.session.__language_code
  const count = ctx.update.message.text

  if (selectedLang === 'ru') {

    if (!isNaN(count)) {
      if (count > 250) {
        return await ctx.reply(`${ctx.i18n.t('enter_before')}`)
      }
      try {
        const films = kinopoiskPopularMovies
        let elem = ''
        for (let i = 0; i < films.length; i++) {
          if (i === Number(count)) break
          let film = films[i];
          const htmlElement = `📈 <b>${i + 1}: ${film.nameRu}</b>\n📊 <b>Рейтинг Кинопоиск: ${film.rating}</b>\n📅 <b>Год: ${film.year}</b>\n\n`
          if (elem.length + htmlElement.length > 4096) {
            await ctx.replyWithHTML(elem)
            elem = htmlElement
          } else {
            elem += htmlElement
          }
        }
        return await ctx.replyWithHTML(elem)
      } catch (error) {
        console.log('error', error)
        return await ctx.reply(`${ctx.i18n.t('whoops')}`)
      }
    } else {
      return await ctx.reply(`${ctx.i18n.t('enter_count')}`)
    }
  } else {
    if (!isNaN(count)) {
      if (count > 250) {
        return await ctx.reply(`${ctx.i18n.t('enter_before')}`)
      }
      try {
        const films = imdbPopularMovies
        let elem = ''
        for (let i = 0; i < films.length; i++) {
          if (i === Number(count)) break
          let film = films[i];
          const htmlElement = `📈 <b>${i + 1}: ${film.title}</b>\n📊 <b>IMDB Rate: ${film.imDbRating}</b>\n📅 <b>Year: ${film.year}</b>\n\n`
          if (elem.length + htmlElement.length > 4096) {
            await ctx.replyWithHTML(elem)
            elem = htmlElement
          } else {
            elem += htmlElement
          }
        }
        await ctx.replyWithHTML(elem)
      } catch (error) {
        console.log('error', error)
        return await ctx.reply(`${ctx.i18n.t('whoops')}`)
      }
    } else {
      return await ctx.reply(`${ctx.i18n.t('enter_count')}`)
    }
  }
})

module.exports = popularScene
