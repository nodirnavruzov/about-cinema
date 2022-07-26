module.exports = (data, from) => {
  if (from === 'omdbapi') {
    const arrayGenres = data.Genre.split(',')
    const film = {
      filmId : data.imdbID,
      title: data.Title,
      year: data.Year,
      genre: arrayGenres,
      director: data.Director,
      IMDB_rating: data.imdbRating,
      type: data.Type,
      poster: data.Poster, 
      lang: '',
    }
    return film
    
  } else {
    const arrayGenres = []
    data.genres.forEach((g) => {
      arrayGenres.push(g.genre)
    })
    const film = {
      filmId : data.kinopoiskId,
      title: data.nameRu,
      year: data.year,
      genre: arrayGenres,
      IMDB_rating: data.ratingImdb,
      type: data.type,
      poster: data.posterUrl,
      lang: '',
    }
    return film
  }
}
