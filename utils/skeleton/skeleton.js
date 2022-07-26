
function createSkeleton(films) {
  let mapedFilms = []
    mapedFilms = films.map((film) => {
      const genres = film.genres.map((g) => g.genre)
      const countries = film.countries.map((g) => g.country)
      return {
        filmId: film.kinopoiskId,
        poster: addPhoto(film.posterUrl),
        title: film.nameRu,
        year:film.year,
        html: `
        📝 <b>Названия: ${film.nameRu ? film.nameRu : film.nameOriginal}</b> \n📈 <b>Кинопоиск: ${film.ratingKinopoisk}</b>\n📈 <b>IMDB: ${film.ratingImdb}</b> \n📅 <b>Год: ${film.year}</b> \n⚙️ <b>Жанр: ${genres}</b> \n🌐 <b>Страна: ${countries}</b> 
        `
      }
    })


  return mapedFilms.sort((a, b) => {
    if (Number(a.year) > Number(b.year)) {
      return 1;
    }
    if (Number(a.year) < Number(b.year)) {
      return -1;
    }
    // a должно быть равным b
    return 0;
  })
}

function addPhoto(url) {
  return url.substr(0,3) === 'htt' ? url : 'https://play-lh.googleusercontent.com/8Wo6Eg3iUaLAz_tFaxGxW9QP3crthfIxXMILX84FMbQHgXHY2ewxf_lzYhpveG0iJQ'
  
}

function createEmoji(key) {
  // 📝📅 📊 📅 ⏳ 📜 ⚙️ ✏️ 👤 📃 📢 🏳️ 🎉 📉 📈 📊 🎬 📀 💰
    switch (key) {
      case 'Title':
        return '📝'
      case 'Year':
        return '📅'
      case 'Rated':
        return '📊'
      case 'Released':
        return '📅'
      case 'Runtime':
        return '⏳'
      case 'Genre':
        return '📜'
      case 'Director':
        return '⚙️'
      case 'Writer':
        return '✏️'
      case 'Actors':
        return '👤'
      case 'Plot':
        return '📃'
      case 'Language':
        return '📢'
      case 'Country':
        return '🏳️'
      case 'Awards':
        return '🎉'
      case 'Metascore':
        return '📉'
      case 'imdbRating':
        return '📈'
      case 'imdbVotes':
        return '📊'
      case 'Type':
        return '🎬'
      case 'DVD':
        return '📀'
      case 'BoxOffice':
        return '💰'
      default:
        return '📝'
    }
  }

module.exports = {
  createSkeleton,
  addPhoto
}