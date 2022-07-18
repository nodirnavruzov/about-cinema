const axios = require('axios')
const { apiKey_kinopoisk_api } = require('./config/keys')



module.exports = async () => {
  const options = {
    method: 'GET',
    headers: {
      'X-API-KEY': apiKey_kinopoisk_api,
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
}

