const { addPhoto } = require('./skeleton')

module.exports = (data) => {
    const films = data.map((film) => {
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
    return films
}
