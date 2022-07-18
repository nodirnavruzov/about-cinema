module.exports = (ctx) => {
  const info = {
    first_name: ctx.update.message.from.first_name,
    username: ctx.update.message.from.username,
    text: ctx.update.message.text
  }
  console.log('Message ==>', info)
  return ctx
}