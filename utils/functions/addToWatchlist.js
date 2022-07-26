const Watchlist = require('../../model/watchlist')
const axios = require('axios')

module.exports = async (ctx) => {
  try {
    await ctx.answerCbQuery()
    const match = ctx.match[0]
    const userId = ctx.update.callback_query.from.id
    const username = ctx.update.callback_query.from.username
    const filmId = match.slice(3)
    const hasMovie = await Watchlist.findOne({kinopoiskId: filmId})
    if (hasMovie) {
      if (hasMovie.status) {
        return await ctx.reply(`Успешно добавлено в список просмотра`)
      } else if(!hasMovie.status){
        const hasMovie = await Watchlist.findOneAndUpdate({filmId: filmId}, {status: true})
        return await ctx.reply(`${hasMovie.title} Успешно добавлено в список просмотра`)
      }
    } else {
      if (filmId[0] === 't') {
        const options = {
          method: 'GET',
          headers: {
            'X-API-KEY': process.env.API_KEY_KINOPOISK,
            'Content-Type': 'application/json',
          },
          url: `https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&imdbId=${filmId}&page=1`
        };
        const { data } = await axios(options)
        const saveResult = await Watchlist.create({...data, tg_id: userId, username})
        if (saveResult) {
          return ctx.reply(`${saveResult.nameRu ? saveResult.nameRu : saveResult.nameOriginal} Успешно добавлено в список просмотра`)
        }
      } else {
        const options = {
          method: 'GET',
          headers: {
            'X-API-KEY': process.env.API_KEY_KINOPOISK,
            'Content-Type': 'application/json',
          },
          url: `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`
        };
        const { data } = await axios(options)
        data.genres = data.genres.map((g) => g.genre)
        data.countries = data.countries.map((g) => g.country)
        const saveResult = await Watchlist.create({...data, tg_id: userId, username})
        if (saveResult) {
          return ctx.reply(`${saveResult.nameRu ? saveResult.nameRu : saveResult.nameOriginal} Успешно добавлено в список просмотра`)
        }
      }
    }

  } catch (error) {	
    console.log('error', error)
    return error
  }
}