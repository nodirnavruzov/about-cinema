const enSearchedMovie = require("../../model/searchedMovieEn");
const ruSearchedMovie = require("../../model/searchedMovieRu");

module.exports = async (ctx, movies) => {
  const lang = ctx.i18n.languageCode
  try {
    if (lang === 'en') {
      for (let i = 0; i < movies.length; i++) {
        let movie = movies[i];
        const hasMovie = await enSearchedMovie.findOne({title: movie.Title, imdbID: movie.imdbID})
        if (hasMovie) return
        let movieObj = {
          title: movie.Title,
          year: movie.Year,
          genre: movie.Genre,
          plot: movie.Plot,
          country: movie.Country,
          poster: movie.Poster,
          imdbRating: movie.imdbRating,
          imdbVotes: movie.imdbVotes,
          imdbID: movie.imdbID,
          type: movie.Type,
          website: movie.Website,
          director: movie.Director,
          actors: movie.Actors,
          language: movie.Language,
          awards: movie.Awards,
          ratings: [...movie.Ratings],
        }
        // console.log('movieObj', movieObj)
        const Movie = new enSearchedMovie(movieObj)  
        // console.log('Movie', Movie)
        await Movie.save()
        // console.log(result)
      }
    } else if (lang === 'ru'){
      for (let i = 0; i < movies.length; i++) {
        let movie = movies[i];
        const hasMovie = await ruSearchedMovie.findOne({title: movie.nameRu, kinopoiskId: movie.kinopoiskId})
        if (hasMovie) return
        // console.log('movie', movie)
        let movieObj = {
          title: movie.nameRu,
          year: movie.year,
          genre: [...movie.genres],
          plot: movie.description,
          country: [...movie.countries],
          poster: movie.posterUrl,
          imdbRating: movie.ratingImdb,
          imdbVotes: movie.ratingImdbVoteCount,
          imdbID: movie.imdbId,
          type: movie.type,
          website: movie.webUrl,
          nameOriginal: movie.nameOriginal,
          ratingKinopoisk: movie.ratingKinopoisk,
          ratingKinopoiskVoteCount: movie.ratingKinopoiskVoteCount,
          kinopoiskId: movie.kinopoiskId,
          slogan: movie.slogan,
        }
        // console.log('movieObj', movieObj)
        const Movie = new ruSearchedMovie(movieObj)  
        // console.log('Movie', Movie)
        await Movie.save()
        // console.log(result)
      }
    }

  } catch (error) {
    console.log(error)
  }
}