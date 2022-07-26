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


// kinopisk
// kinopoiskId: 572032,
// imdbId: null,
// nameRu: 'Топ Ган: Мэверик',
// nameEn: null,
// nameOriginal: 'Top Gun: Maverick',
// posterUrl: 'https://kinopoiskapiunofficial.tech/images/posters/kp/572032.jpg',
// posterUrlPreview: 'https://kinopoiskapiunofficial.tech/images/posters/kp_small/572032.jpg',
// coverUrl: null,
// logoUrl: null,
// reviewsCount: 11,
// ratingGoodReview: 83.3,
// ratingGoodReviewVoteCount: 2,
// ratingKinopoisk: 8.1,
// ratingKinopoiskVoteCount: 9613,
// ratingImdb: 8.6,
// ratingImdbVoteCount: 229141,
// ratingFilmCritics: 8.2,
// ratingFilmCriticsVoteCount: 431,
// ratingAwait: 89.33,
// ratingAwaitCount: 27417,
// ratingRfCritics: null,
// ratingRfCriticsVoteCount: 0,
// webUrl: 'https://www.kinopoisk.ru/film/572032/',
// year: 2022,
// filmLength: 130,
// slogan: null,
// description: 'Пит Митчелл по прозвищу Мэверик более 30 лет остается одним из лучших пилотов ВМФ: бесстрашный летчик-испытатель, он расширяет границы возможного и старательно избегает повышения в звании, которое заставило бы его приземлиться навсегда. Приступив к подготовке отряда выпускников «Топ Ган» для специальной миссии, подобной которой никогда не было, Мэверик встречает лейтенанта Брэдли Брэдшоу, сына своего покойного друга, лейтенанта Ника Брэдшоу.\n' +
//   '\n' +
//   'Впереди — неопределенность, за спиной — призраки прошлого. Мэверик вынужден противостоять своим глубинным страхам, которые грозят ожить в рамках миссии, требующей исключительной самоотверженности от тех, кто будет назначен на вылет.',
// shortDescription: null,
// editorAnnotation: null,
// isTicketsAvailable: false,
// productionStatus: null,
// type: 'FILM',
// ratingMpaa: 'pg13',
// ratingAgeLimits: 'age16',
// countries: [ { country: 'США' } ],
// genres: [ { genre: 'драма' }, { genre: 'боевик' } ],
// startYear: null,
// endYear: null,
// serial: false,
// shortFilm: false,
// completed: false,
// hasImax: true,
// has3D: false,
// lastSync: '2022-07-15T14:43:23.000492'