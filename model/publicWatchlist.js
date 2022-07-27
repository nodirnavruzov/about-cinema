const { model, Schema } = require('mongoose'); 


const publicWatchlistSchema = new Schema({
  tg_id: {
    type: String
  },
  username: {
    type: String
  },
  status: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});


module.exports = model('PublicWatchlist', publicWatchlistSchema);