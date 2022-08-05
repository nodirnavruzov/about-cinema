const addPhoto = require('../functions/addPhoto')


module.exports = (data) => {
  let mapedFilms = []
  data.docs.forEach((film) => {
    const arrayGenres = []
    const arrayCountry = []
    if (film.nameRu) {
      console.log(typeof film.countries[0])
      if (typeof film.countries[0] === 'object') {
        film.genres.forEach((g) => {
          arrayGenres.push(g.genre)
        })
        film.countries.forEach((g) => {
          arrayCountry.push(g.country)
        })
      }  
      mapedFilms.push( {
        filmId: film.kinopoiskId,
        poster: addPhoto(film.posterUrl),
        title: film.nameRu,
        year:film.year,
        html: `
        📝 <b>Названия: ${film.nameRu}</b> \n📈 <b>Кинопоиск: ${film.ratingKinopoisk}</b>\n📈 <b>IMDB: ${film.ratingImdb}</b> \n📅 <b>Год: ${film.year}</b> \n⚙️ <b>Жанр: ${arrayGenres.length ? arrayGenres :film.genres}</b> \n🌐 <b>Страна: ${arrayCountry.length ? arrayCountry : film.countries}</b> 
        `
      })
    }
  })

  return {
    page: data.page,
    count: data.count,
    total: data.total,
    docs: mapedFilms
  }
}

