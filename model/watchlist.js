const { model, Schema } = require('mongoose'); 


const watchlistSchema = new Schema({
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
  lang: {
    type: String
  },
  tg_id: {
    type: String
  },
  username: {
    type: String
  },
  status: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
});


module.exports = model('Watchlist', watchlistSchema);