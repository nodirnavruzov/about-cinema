const { model, Schema } = require('mongoose'); 

const searchedMovieRuSchema = new Schema({
  title: {
    type:String
  },
  year: {
    type:String
  },
  genre: {
    type:Array
  },
  plot: {
    type:String
  },
  country: {
    type: Array
  },
  poster: {
    type:String
  },
  imdbRating: {
    type:String
  },
  imdbVotes: {
    type:String
  },
  imdbID: {
    type:String
  },
  type: {
    type:String
  },
  website: {
    type:String
  },
  nameOriginal: {
    type:String
  },
  ratingKinopoisk: {
    type:String
  },
  ratingKinopoiskVoteCount: {
    type:String
  },
  kinopoiskId: {
    type:String
  },
  slogan: {
    type:String
  },
});

module.exports = model('ruSearchedMovie', searchedMovieRuSchema);




// {
  // title: nameRu,
  // year: year
  // genre: genres
  // plot: description
  // country: countries
  // poster: posterUrl


  // imdbRating: ratingImdb
  // imdbVotes: ratingImdbVoteCount
  // imdbID: imdbId
  // type: type
  // website: webUrl

  // nameOriginal: nameOriginal,
  // ratingKinopoisk: ratingKinopoisk
  // ratingKinopoiskVoteCount: ratingKinopoiskVoteCount
  // kinopoiskId: kinopoiskId
  // slogan: slogan
// }

