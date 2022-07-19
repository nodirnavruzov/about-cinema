const { addPhoto } = require('../skeleton')
module.exports = (data) => {
  const films = data.map((film) => {
    const arrayGenres = []
    film.genres.forEach((g) => {
      arrayGenres.push(g.genre)
    })
    return {
      film_id: film.kinopoiskId,
      poster: addPhoto(film.posterUrl),
      title: film.nameRu ? film.nameRu : film.nameOriginal,
      year:film.year,
      genres: arrayGenres,
      html: `
      📝 <b>Title: ${film.nameRu ? film.nameRu : film.nameOriginal}</b> \n📈 <b>Rating Kinopoisk: ${film.ratingKinopoisk}</b> \n📈 <b>IMDB: ${film.ratingImdb}</b> \n📅 <b>Year: ${film.year}</b>
      `
    }
  })
  return films
}