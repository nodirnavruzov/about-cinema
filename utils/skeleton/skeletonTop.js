const {addPhoto} = require('./skeleton')


module.exports = (data, ctx) => {
  let mapedFilms = []
  mapedFilms = data.docs.map((film) => {
    // const genres = film.genres.map((g) => g.genre)
    // const countries = film.countries.map((g) => g.country)
    return {
      filmId: film.kinopoiskId,
      poster: addPhoto(film.posterUrl),
      title: film.nameRu,
      year:film.year,
      html: `
      📝 <b>Названия: ${film.nameRu}</b> \n📈 <b>Кинопоиск: ${film.ratingKinopoisk}</b>\n📈 <b>IMDB: ${film.ratingImdb}</b> \n📅 <b>Год: ${film.year}</b> \n⚙️ <b>Жанр: ${film.genres}</b> \n🌐 <b>Страна: ${film.countries}</b> 
      `
    }
  })
  return {
    page: data.page,
    count: data.count,
    total: data.total,
    docs: mapedFilms
  }
}
