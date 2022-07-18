const { Scenes, Markup } = require('telegraf');
const { commandHandler } = require('../handler/commandHandler');
const helpButton = require('../button/help')
const countButton = require('../button/count');
const menuButton = require('../button/menu');
const kinopoiskTopMovies  = require('../movies/kinopoisk/top.json')
const imdbTopMovies  = require('../movies/imdb/top.json')
const topScene = new Scenes.BaseScene('topScene')

topScene.enter(async (ctx) => {
  countButton(ctx)
  return topScene 
})

topScene.start(async (ctx) => {
  try {
    await ctx.reply(`${ctx.i18n.t('hello')} ${ctx.update.message.from.first_name} 🥰 ${ctx.i18n.t('i_know_about_movie')} 🙃`)
    await ctx.reply(`${ctx.i18n.t('you_want')} /help`)
  } catch (error) {
    console.log('error', error)
  }
})

topScene.help(async (ctx) => {
  helpButton(ctx)
})

topScene.command('menu', async (ctx) => {
  menuButton(ctx)
})

topScene.command('lang', async (ctx) => {
  ctx.scene.enter('languageScene')
})

topScene.command('search', async (ctx) => {
  ctx.scene.enter('searchCinemaScene')
})

topScene.command('top', async (ctx) => {
  ctx.scene.enter('topScene')
})

topScene.command('popular', async (ctx) => {
  ctx.scene.enter('popularScene')
})

topScene.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
  }
})  

topScene.on('text', async (ctx) => {
  const selectedLang = ctx.session.__language_code
  const count = ctx.update.message.text
  
  if (!isNaN(count)) {
    if (count > 250) {
      return ctx.reply(`${ctx.i18n.t('enter_before')}`)
    }
    if (selectedLang === 'ru') {
      try {
        const films = kinopoiskTopMovies
        let elem = ''
        for (let i = 0; i < films.length; i++) {
          if (i === Number(count)) break
          let film = films[i];
          const htmlElement = `📈 <b>${i + 1}: ${film.nameRu}</b>\n📊 <b>Рейтинг Кинопоиск: ${film.rating}</b>\n📅 <b>Год: ${film.year}</b>\n\n`
          // may be work incorrect, need chek
          if (elem.length + htmlElement.length > 4096) {
            await ctx.replyWithHTML(elem)
            elem = ''
            elem += htmlElement
          } else {
            elem += htmlElement
          }
        }
        await ctx.replyWithHTML(elem)
      } catch (error) {
        console.log('error', error)
        return await ctx.reply(`${ctx.i18n.t('whoops')}`)
      }
  
    } else if (selectedLang === 'en'){
      try {
        const films = imdbTopMovies
        let elem = ''
        for (let i = 0; i < films.length; i++) {
          if (i === Number(count)) break
          let film = films[i];
          const htmlElement = `📈 <b>${i + 1}: ${film.title}</b>\n📊 <b>IMDB Rate: ${film.imDbRating}</b>\n📅 <b>Year: ${film.year}</b>\n\n`
          // may be work incorrect, need chek
          if (elem.length + htmlElement.length > 4096) {
            await ctx.replyWithHTML(elem)
            elem = ''
            elem += htmlElement
          } else {
            elem += htmlElement
          }
        }
        await ctx.replyWithHTML(elem)
      } catch (error) {
        console.log('error', error)
        return await ctx.reply(`${ctx.i18n.t('whoops')}`)
      } 
    }
  } else {
    return await ctx.reply(`${ctx.i18n.t('enter_count')}`)
  }
})


module.exports = topScene
