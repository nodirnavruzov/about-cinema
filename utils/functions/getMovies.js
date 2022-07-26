module.exports =  async (ctx) => {
  try {
    const selectedLang = ctx.session.__language_code
    let { page, limit } = ctx.session.popular.kp
    let count = +limit  
    if (selectedLang === 'ru') {
      var query = {};
      const docs = await KpPopular100.find(query)
        .sort({ createdAt: 1 })
        .skip(page * limit)
        .limit(limit)
        .exec()
      const totalCount = await KpPopular100.estimatedDocumentCount(query)
      if ((page + 1) * limit > totalCount) {
        console.log('tugadi')
      }
      ctx.session.popular.kp.page = ++ctx.session.popular.kp.page
      return {
        total: totalCount,
        page, 
        count,
        docs,
      }
    } else {
      var query = {};
      const docs = await ImdbPopular.find(query)
        .sort({ createdAt: 1 })
        .skip(page * limit)
        .limit(limit)
        .exec()
      const totalCount = await ImdbPopular.estimatedDocumentCount(query)
      if ((page + 1) * limit > totalCount) {
        console.log('tugadi')
      }
      ctx.session.popular.imdb.page = ++ctx.session.popular.imdb.page
      return {
        total: totalCount,
        page, 
        count,
        docs,
      }
    }
  } catch(error) {
    console.log(error)
  }
}