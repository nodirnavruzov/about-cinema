// const axios = require('axios')
// const fs = require('fs')
// const path = require('path');
// const Imdb250 = require('../../model/imdb250');
// const ImdbPopular = require('../../model/imdbPopular');
// require('dotenv').config()



// async function imdbGetMoviesByType(typeName) {
//   try {
//     const type = typeName === 'top' ? 'Top250Movies' : typeName === 'popular' ? 'MostPopularMovies' : ''
//     if (type === '') return  
//     if (type === 'Top250Movies') {
//       const { data } = await axios.get('http://localhost:4000/api/imdb/top');
//       for (let i = 0; i < data.length; i++) {
//         const movie = data[i];
//         const res = await Imdb250.create(movie)
//         console.log('res', res)
//       }
//     } else {
//       const { data } = await axios.get('http://localhost:4000/api/imdb/popular/');
//       for (let i = 0; i < data.length; i++) {
//         const movie = data[i];
//         const res = await ImdbPopular.create(movie)
//         console.log('res', res)
//       }
//     }

//   } catch (error) {
//     console.log('ERROR imdbGetMoviesByType', error)

//   }
// }

// module.exports = {
//   imdbGetMoviesByType
// }

