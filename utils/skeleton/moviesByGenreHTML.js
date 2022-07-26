const { addPhoto } = require('./skeleton')
module.exports = (data) => {
  const films = data.map((film) => {
    if (film.nameRu || film.nameOriginal) {
      const arrayGenres = []
      const arrayCountry = []
      film.genres.forEach((g) => {
        arrayGenres.push(g.genre)
      })
      film.countries.forEach((g) => {
        arrayCountry.push(g.country)
      })
      return {
        filmId: film.kinopoiskId,
        poster: addPhoto(film.posterUrl),
        title: film.nameRu ? film.nameRu : film.nameOriginal,
        year:film.year,
        genres: arrayGenres,
        html:  `
        📝 <b>Названия: ${film.nameRu ? film.nameRu : film.nameOriginal}</b> \n📈 <b>Кинопоиск: ${film.ratingKinopoisk}</b>\n📈 <b>IMDB: ${film.ratingImdb}</b> \n📅 <b>Год: ${film.year}</b> \n⚙️ <b>Жанр: ${arrayGenres}</b> \n🌐 <b>Страна: ${arrayCountry}</b> 
        `
      }
    }
  })
  return films
}
