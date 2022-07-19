
function createSkeleton(films, lang) {
  let mapedFilms = []
  if (lang === 'ru') {
    mapedFilms = films.map((film) => {
      return {
        kinopoiskId: film.kinopoiskId,
        imdbID: film.imdbID,
        poster: addPhoto(film.posterUrl),
        title: film.nameRu,
        year:film.year,
        html: `
        📝 <b>Названия: ${film.nameRu}</b> \n📈 <b>Кинопоиск: ${film.kinopoiskRating}</b> \n📅 <b>Год: ${film.year}</b> \n⚙️ <b>Director: ${film.director ? film.director : 'неизвестно'}</b> 
        `
      }
    })
  } else {
    mapedFilms = films.map((film) => {
      return {
          imdbID: film.imdbID,
          poster: addPhoto(film.Poster),
          title: film.Title,
          year:film.Year,
          html: `
          📝 <b>Title: ${film.Title}</b> \n📈 <b>IMDB: ${film.imdbRating}</b> \n📅 <b>Year: ${film.Year}</b> \n⚙️ <b>Director: ${film.Director}</b> 
          `
      }
    })
  }


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

function parseData(data, ctx) {
  let html = ''
  let filmObject
  delete data.imdbID
  delete data.Response
  for (const key in data) {
    const value = data[key];
    if ((value !== 'N/A' && !Array.isArray(value)) && key !== 'Poster') {
      html += `${createEmoji(key)} <b>${ctx.i18n.t(`${key}`)}: ${value}</b> \n` 
    }
  }

  filmObject = {
    poster: addPhoto(data.Poster),
    year: data.Year,
    html
  }
  return filmObject
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
  parseData,
  addPhoto
}