const axios = require('axios')
const fs = require('fs')
const path = require('path')
require('dotenv').config()



async function imdbGetMoviesByType(typeName) {
  const type = typeName === 'top' ? 'Top250Movies' : typeName === 'popular' ? 'MostPopularMovies' : ''
  if (type === undefined) return  
  let allMovies = []
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      url: `https://imdb-api.com/en/API/${type}/${process.env.API_KEY_IMDB}`
    };
    const { data } = await axios(options)
    
    allMovies = [...data.items]

    fs.writeFile(__dirname + `../../../movies/imdb/${typeName}.json`, JSON.stringify(allMovies), 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
  
      console.log("JSON file has been saved.");
    });
}

module.exports = {
  imdbGetMoviesByType
}