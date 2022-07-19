const { model, Schema } = require('mongoose'); 


const watchlistSchema = new Schema({
  film_id: {
    type: String
  },
  title: {
    type: String
  },
  year: {
    type: String
  },
  genre: {
    type: Array
  },
  director: {
    type: String
  },
  IMDB_rating: {
    type: String
  },
  type: {
    type: String
  },
  poster: {
    type: String
  },
  lang: {
    type: String
  },
  tg_id: {
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

// filmId: 572032,
// nameRu: 'Топ Ган: Мэверик',
// nameEn: 'Top Gun: Maverick',
// type: 'FILM',
// year: '2022',
// description: 'Пит Митчелл по прозвищу Мэверик более 30 лет остается одним из лучших пилотов ВМФ: бесстрашный летчик-испытатель, он расширяет границы возможного и старательно избегает повышения в звании, которое заставило бы его приземлиться навсегда. Приступив к подготовке отряда выпускников «Топ Ган» для специальной миссии, подобной которой никогда не было, Мэверик встречает лейтенанта Брэдли Брэдшоу, сына своего покойного друга, лейтенанта Ника Брэдшоу.\n' +
//   '\n' +
//   'Впереди — неопределенность, за спиной — призраки прошлого. Мэверик вынужден противостоять своим глубинным страхам, которые грозят ожить в рамках миссии, требующей исключительной самоотверженности от тех, кто будет назначен на вылет.',
// filmLength: '02:10',
// countries: [Array],
// genres: [Array],
// rating: '8.1',
// ratingVoteCount: 9613,
// posterUrl: 'https://kinopoiskapiunofficial.tech/images/posters/kp/572032.jpg',
// posterUrlPreview: 'https://kinopoiskapiunofficial.tech/images/posters/kp_small/572032.jpg'



// Title: 'Top Gun: Maverick',
// Year: '2022',
// Rated: 'PG-13',
// Released: '27 May 2022',
// Runtime: '130 min',
// Genre: 'Action, Drama',
// Director: 'Joseph Kosinski',
// Writer: 'Jim Cash, Jack Epps Jr., Peter Craig',
// Actors: 'Tom Cruise, Jennifer Connelly, Miles Teller',
// Plot: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground",
// Language: 'English',
// Country: 'United States, China',
// Awards: 'N/A',
// Poster: 'https://m.media-amazon.com/images/M/MV5BOWQwOTA1ZDQtNzk3Yi00ZmVmLWFiZGYtNjdjNThiYjJhNzRjXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg',
// Ratings: [ [Object],  [Object], [Object] ],
// Metascore: '78',
// imdbRating: '8.6',
// imdbVotes: '195,758',
// imdbID: 'tt1745960',
// Type: 'movie',
// DVD: 'N/A',
// BoxOffice: '$520,836,963',
// Production: 'N/A',
// Website: 'N/A',
// Response: 'True'

module.exports = model('Watchlist', watchlistSchema);