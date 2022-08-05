const { Markup } = require('telegraf');


module.exports = async (ctx, movies) => {
  try {
    for (let i = 0; i < movies.docs.length; i++) {
      const movie = movies.docs[i];
      let buttons = [] 
      if (movie.title && movie.title.length > 21) {
        movie.title = movie.title.slice(0, 21)
      }
      if ((movies.page + 1) * movies.limit > movies.total) {
        buttons = [
          [
            Markup.button.callback(`Трейлер`, `${movie.title}_${movie.year}`), 
            Markup.button.callback(`Добавить в список`, `wl_${movie.filmId}`), 
          ],
          [
            Markup.button.callback(`Смотреть`, `link_${movie.filmId}`), 
  
          ]
        ]
      } else {
        if (movies.docs.length === i + 1) {
          buttons = [
            [
              Markup.button.callback(`Трейлер`, `${movie.title}_${movie.year}`), 
              Markup.button.callback(`Добавить в список`, `wl_${movie.filmId}`), 
            ],
            [
            Markup.button.callback(`Смотреть`, `link_${movie.filmId}`), 
  
            ],
            [
              Markup.button.callback(`Еще`, `more`), 
            ]
          ]
        } else {
          buttons = [
            [
              Markup.button.callback(`Трейлер`, `${movie.title}_${movie.year}`), 
              Markup.button.callback(`Добавить в список`, `wl_${movie.filmId}`), 
            ],
            [
            Markup.button.callback(`Смотреть`, `link_${movie.filmId}`), 
  
            ]
          ]
        }
      }
      console.log('sendMovies', i, movie)
      await ctx.replyWithPhoto({url: movie.poster}, { caption: movie.html, parse_mode: 'HTML',
        ...Markup.inlineKeyboard(
          buttons
        )
      })
    }
  } catch(error) {
    console.log('ERROR SendMovies', error)
  }
}