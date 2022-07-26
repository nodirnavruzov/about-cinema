const { model, Schema } = require('mongoose'); 

const imdb250Schema = new Schema({
  kinopoiskId: {
    type: String
  },
  imdbId: {
    type: String
  },
  nameRu: {
    type: String
  },
  nameOriginal: {
    type: String
  },
  type: {
    type: String
  },
  year: {
    type: String
  },
  countries: {
    type: Array
  },
  genres: {
    type: Array
  },
  ratingKinopoisk: {
    type: String
  },
  ratingImdb: {
    type: String
  },
  posterUrl: {
    type: String
  },
  posterUrlPreview: {
    type: String
  },
},
{timestamps: true} 
);

module.exports = model('imdb250', imdb250Schema);


