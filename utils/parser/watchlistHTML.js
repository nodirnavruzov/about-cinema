const { addPhoto } = require('../skeleton')
module.exports = (data) => {
    const films = data.map((film) => {
      return {
        film_id: film.film_id,
        poster: addPhoto(film.poster),
        title: film.title,
        year:film.year,
        html: `
        📝 <b>Title: ${film.title}</b> \n📈 <b>IMDB: ${film.IMDB_rating}</b> \n📅 <b>Year: ${film.year}</b> \n⚙️ <b>Director: ${film.director}</b> 
        `
      }
    })

    return films
}