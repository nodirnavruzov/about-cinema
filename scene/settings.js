const { Scenes, Markup, Telegraf } = require('telegraf');
const PublicWatchlist = require('../model/publicWatchlist');

const settingsScene = new Scenes.BaseScene('settingsScene')

settingsScene.enter(async (ctx) => {

  await ctx.reply('Выбери меню', Markup
  .keyboard([
    ['Плейлист'],
  ]).oneTime().resize())  
})

settingsScene.start(async (ctx) => {
  try {
    await ctx.reply(`Привет ${ctx.update.message.from.first_name} 🥰 Я знаю много информацию о фильмах 🙃`)
    await ctx.reply(`Хочешь найти информацию о фильме? /help`)
  } catch (error) {
    console.log('error', error)
  }
})

settingsScene.help(async (ctx) => {
  helpButton(ctx)
})

settingsScene.command('menu', async (ctx) => {
  menuButton(ctx)
})

settingsScene.command('search', async (ctx) => {
  ctx.scene.enter('searchCinemaScene')
})

settingsScene.command('top', async (ctx) => {
  ctx.scene.enter('topScene')
})

settingsScene.command('popular', async (ctx) => {
  ctx.scene.enter('popularScene')
})

settingsScene.command('watchlist', async (ctx) => {
  ctx.scene.enter('watchlistScene')
})

settingsScene.command('publicwl', async (ctx) => {
  ctx.scene.enter('publicWatchlistScene')
})

settingsScene.command('settings', async (ctx) => {
  ctx.scene.enter('settingsScene')
})

settingsScene.hears('Плейлист', async (ctx) => {
  const tg_id = ctx.update.message.from.id
  const result = await PublicWatchlist.findOne({tg_id, status: true})
  console.log('result', result)
  if (!result) {
    await ctx.replyWithHTML('<b>Выберите состояние плейлиста\nТекущая состояние: Приватный</b>', {parse_mode: 'HTML',
      ...Markup.inlineKeyboard(
        [
          Markup.button.callback(`Сделать публичным`, `yes_${tg_id}`) 
        ]
      )
    })
  } else {
    await ctx.replyWithHTML('<b>Выберите состояние плейлиста\nТекущая состояние: Публичный</b>',{parse_mode: 'HTML',
      ...Markup.inlineKeyboard(
        [
          Markup.button.callback(`Сделать приватном`, `no_${tg_id}`) 
        ]
      )
    })
  }
})

settingsScene.action(/(yes_.+)/, async (ctx) => {
  try {
    const messId = ctx.update.callback_query.message.message_id
    const tg_id = ctx.update.callback_query.from.id
    const username = ctx.update.callback_query.from.username
    await PublicWatchlist.updateOne({tg_id}, {status: true, username}, {upsert : true })
    await ctx.answerCbQuery()
    await ctx.reply('Настройки обновлены')
    await ctx.telegram.deleteMessage(ctx.update.callback_query.message.chat.id, messId)
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})

settingsScene.action(/(no_.+)/, async (ctx) => {
  try {
    const tg_id = ctx.update.callback_query.from.id
    const messId = ctx.update.callback_query.message.message_id
    const username = ctx.update.callback_query.from.username
    await PublicWatchlist.updateOne({tg_id}, {status: false, username}, {upsert : true })
    await ctx.answerCbQuery()
    await ctx.reply('Настройки обновлены')
    await ctx.telegram.deleteMessage(ctx.update.callback_query.message.chat.id, messId)
  } catch (error) {	
    console.log('error', error)
    return await ctx.reply(`Упс! Что то пошло не так, повтори попытку позже!`)
  }
})


module.exports = settingsScene
