const axios = require('axios')
require('dotenv').config()



module.exports = async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.API_KEY_KINOPOISK,
        'Content-Type': 'application/json',
      },
      url: `https://kinopoiskapiunofficial.tech/api/v2.2/films/filters`
    };
    const { data } = await axios(options)
    const { genres } = data
    const myGenres = genres.filter((g) => {
      switch (g.genre) {
        case 'комедия': return g
        case 'фантастика': return g
        case 'ужасы': return g
        case 'боевик': return g
        case 'криминал': return g
        case 'мелодрама': return g
        case 'детектив': return g
        case 'триллер': return g
        case 'биография': return g
        case 'мультфильм': return g
      }
    })
    return myGenres
  } catch (error) {
    console.log('error', error)
  }
}

