const { model, Schema } = require('mongoose'); 

const searchedMovieEnSchema = new Schema({
  title: {
    type: String
  },
  year: {
    type: String
  },
  genre: {
    type: String
  },
  plot: {
    type: String
  },
  country: {
    type: String
  },
  poster: {
    type: String
  },
  imdbRating: {
    type: String
  },
  imdbVotes: {
    type: String
  },
  imdbID: {
    type: String
  },
  type: {
    type: String
  },
  website: {
    type: String
  },
  director: {
    type: String
  },
  actors: {
    type: String
  },
  language: {
    type: String
  },
  awards: {
    type: String
  },
  ratings: {
    type: Array
  },
  langSearch: {
    type: String
  }
});






module.exports = model('enSearchedMovie', searchedMovieEnSchema);