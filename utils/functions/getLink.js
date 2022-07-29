const axios = require('axios')

module.exports = async (filmId) => {
  try {
    console.log(process.env['X-API-KEY'])
    const optionsMovie = {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.API_KEY_KINOPOISK,
        'Content-Type': 'application/json',
      },
      url: `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`
    };
    const { data } = await axios(optionsMovie)
    console.log('data', data)
    const options = {
      method: 'POST',
      data: {
        title: data.nameRu,
        year: data.year,
        country: data.countries[0].country
      },
      headers: {
        'X-API-KEY': process.env['X-API-KEY'], 
        'Content-Type': 'application/json',
      },
      url: `http://localhost:8081/movie`
    };
    const result = await axios(options)
    console.log('result', result.data)
    return result.data
  } 
  catch (error) {
    console.log(error)
  }
}