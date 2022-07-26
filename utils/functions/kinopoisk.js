// const axios = require('axios')
// const fs = require('fs')
// const path = require('path');
// const kpBest250 = require('../../model/kpBest250');
// const kpPopular100 = require('../../model/kpPopular100');
// require('dotenv').config()




// async function kinopoiskGetMoviesByType(typeName) {
//   try {
//   const type = typeName === 'top' ? 'TOP_250_BEST_FILMS' : typeName === 'popular' ? 'TOP_100_POPULAR_FILMS' : ''
//     if (type === '') return
    
//     if (type === 'TOP_250_BEST_FILMS') {
//       const { data } = await axios.get('http://localhost:4000/api/kp/top/');
//       for (let i = 0; i < data.length; i++) {
//         const movie = data[i];
//         const res = await kpBest250.create(movie)
//         console.log('res', res)
//       }
//     } else {
//       const { data } = await axios.get('http://localhost:4000/api/kp/popular/');
//       for (let i = 0; i < data.length; i++) {
//         const movie = data[i];
//         const res = await kpPopular100.create(movie)
//         console.log('res', res)
//       }
//     }
//   } catch (error) {
//     console.log('ERROR kinopoiskGetMoviesByType', error)
//   }
// }

// module.exports = {
//   kinopoiskGetMoviesByType
// }