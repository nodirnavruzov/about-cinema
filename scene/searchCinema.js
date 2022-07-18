const { Scenes, Markup, Telegraf } = require('telegraf');
const axios = require('axios')
const { createSkeleton, parseData } = require('../utils/skeleton')
const trailer = require('../getTrailer')
const { commandHandler } = require('../handler/commandHandler')
const helpButton = require('../button/help')
const menuButton = require('../button/menu');

const { apiKey_imdb_api, apiKey_kinopoisk_api, apiKey_omdb } = require('../config/keys')


const searchCinemaScene = new Scenes.BaseScene('searchCinemaScene')

searchCinemaScene.use(Telegraf.log())

searchCinemaScene.enter(async (ctx) => {
    ctx.reply(`${ctx.i18n.t('enter_movie_name')}.\n${ctx.i18n.t('for_example')} ${ctx.i18n.t('iron_man')} ${ctx.i18n.t('or')} ${ctx.i18n.t('batman')}`)
    return searchCinemaScene
})

searchCinemaScene.start(async (ctx) => {
  try {
    await ctx.reply(`${ctx.i18n.t('hello')} ${ctx.update.message.from.first_name} 🥰 ${ctx.i18n.t('i_know_about_movie')} 🙃`)
    await ctx.reply(`${ctx.i18n.t('you_want')} /help`)
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

searchCinemaScene.command('lang', async (ctx) => {
  ctx.scene.enter('languageScene')
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

searchCinemaScene.on('text', async (ctx, next) => {
  try {
    commandHandler(ctx, next)
  } catch (error) {
    console.log('error', error)
  }
})  

searchCinemaScene.on('text', async (ctx) => {
  try {
    ctx.reply(`${ctx.i18n.t('cool')} ☺️`)
    const text = ctx.update.message.text
    const result = await filmsByName(ctx, text)
    for (let i = 0; i < result.length; i++) {
      const elem = result[i];
      await sendMessage(ctx, elem)
    }
  } catch (error) {
    console.log('error', error)
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
  }
})

// если начинается с id_
searchCinemaScene.action(/(id_.+)/, async (ctx) => {
  await ctx.answerCbQuery()
  const match = ctx.match[0]
  const filmId = match.slice(3)
  try {
    const { data } = await axios.get(`http://www.omdbapi.com/?i=${filmId}&apikey=${apiKey_omdb}`)
    if (data.Response === 'False') {
      return ctx.reply(ctx.i18n.t('no_info_abaout_movie'))
    }
    const parsedData = parseData(data, ctx) 
    return await ctx.replyWithPhoto({url: parsedData.poster}, {caption: parsedData.html, parse_mode: 'HTML'})
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
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
    return await ctx.reply(`${ctx.i18n.t('whoops')}`)
  }
})

async function sendMessage(ctx, elem) {
  return await ctx.replyWithPhoto({url: elem.poster}, {   caption: elem.html,parse_mode: 'HTML',
  ...Markup.inlineKeyboard(
    [
      [
          Markup.button.callback(`${ctx.i18n.t('more_info')}`, `id_${elem.imdbID}`), 
          Markup.button.callback(`${ctx.i18n.t('trailer')}`, `${elem.title}`), 
      ]
    ]
  )})
}

const filmsByName = async (ctx, name) => {
  const selectedLang = ctx.session.__language_code
  if (selectedLang === 'ru') {
    try {
      const options = {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey_kinopoisk_api,
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
              'X-API-KEY': apiKey_kinopoisk_api,
              'Content-Type': 'application/json',
            },
            url: `https://kinopoiskapiunofficial.tech/api/v2.2/films/${film.filmId}`
          };
          let result = await axios(options)
          result = result.data
          const { data } = await axios.get(`http://www.omdbapi.com/?i=${result.imdbId}&apikey=${apiKey_omdb}`)
          let filmObject = {}
          if (data.Response !== 'False') {
            filmObject = {
              kinopoiskId: result.kinopoiskId,
              posterUrl: result.posterUrl,
              nameRu: result.nameRu,
              year: result.year,
              kinopoiskRating: result.ratingKinopoisk,
              director: data.Director,
              imdbID: data.imdbID
            }
          } else {
            filmObject = {
              kinopoiskId: result.kinopoiskId,
              posterUrl: result.posterUrl,
              nameRu: result.nameRu,
              year: result.year,
              kinopoiskRating: result.ratingKinopoisk,
              imdbID: null
            }    
          }

          arrayFilms.push(filmObject)
        }
        return createSkeleton(arrayFilms, selectedLang)
      }  else {
        return ctx.reply(`Фильмы с названием *${name}* не найденно! 😔` )
      }
    } catch (error) {
      console.log('error', error)
      return await ctx.reply(`${ctx.i18n.t('whoops')}`)
    }
  } else if (selectedLang === 'en') {
    try {
      const { data } = await axios.get(`http://www.omdbapi.com/?s=${name}&type=movie&apikey=${apiKey_omdb}`)
      if (data.Response !== 'False') {
        const foundFilms = data.Search
        const arrayFilms = []
        for (film of foundFilms) {
          const { data } = await axios.get(`http://www.omdbapi.com/?i=${film.imdbID}&apikey=${apiKey_omdb}`)
          arrayFilms.push(data)
        } 
        return createSkeleton(arrayFilms, selectedLang)
      } else {
        return ctx.reply(`Фильмы с названием *${name}* не найденно! 😔` )
      }
    } catch (error) {
      console.log('error', error)
      return await ctx.reply(`${ctx.i18n.t('whoops')}`)
    }
  }

}

module.exports = searchCinemaScene