const { model, Schema } = require('mongoose'); 

const kp250BestSchema = new Schema({
  kinopoiskId: {
    type: String
  },
  imdbId: {
    type: String
  },
  nameRu: {
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

module.exports = model('kp250best', kp250BestSchema);


