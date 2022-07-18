const YouTube = require("youtube-sr").default;

module.exports = (name) => {
  return YouTube.search(`${name} Трейлер`, { limit: 1 })
  .then(x =>  {
    const url = `https://www.youtube.com/watch?v=${x[0].id}&ab_channel=${x[0].channel.name}`
    return url    
  })
  .catch(console.error);
}
