const axios = require('axios')
const { apiKey_kinopoisk_api } = require('../../config/keys')
const fs = require('fs')
const path = require('path')




async function kinopoiskGetMoviesByType(typeName) {
  const type = typeName === 'top' ? 'TOP_250_BEST_FILMS' : typeName === 'popular' ? 'TOP_100_POPULAR_FILMS' : ''
  console.log('typeName', typeName)
  console.log('type', type)
  if (type === undefined) return  
  let page = 1
  let allMovies = []
  for (let index = 0; index < page; index++) {
    console.log('index', index)
    
    const options = {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey_kinopoisk_api,
        'Content-Type': 'application/json',
      },
      url: `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=${type}&page=${page}`
    };
    const { data } = await axios(options)
    // console.log('data', data)
    
    allMovies = [...allMovies, ...data.films]
    // console.log('allMovies', allMovies)

    if (data.pagesCount !== page) {
      page++
    } else {
      break 
    }
  }
    fs.writeFile(__dirname + `../../../movies/kinopoisk/${typeName}.json`, JSON.stringify(allMovies), 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
      console.log("JSON file has been saved.");
    });
}

module.exports = {
  kinopoiskGetMoviesByType
}