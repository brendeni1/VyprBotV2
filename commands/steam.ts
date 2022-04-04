import utils from '../utils'

module.exports = async (client, context) => {
  try {
    let game = context.args.join(' ')
    let query = await utils.searchSteam(game)
    if (!query) {
      return {
        success: true,
        reply: `No Steam data could be found with that game name. Try re-formatting or re-phrasing. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
      }
    }
    let id = String(query.appid).replace(/^413180$|^362003$/, '271590')
    let gameDetails = await utils.fetch(`https://store.steampowered.com/api/appdetails?appids=${id}`)
    id = +id
    if(!gameDetails[id].success) {
      return {
        success: false,
        reply: `No Steam data could be found with that game name. Try re-formatting or re-phrasing. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
      }
    }
    gameDetails = gameDetails[id].data
    game = gameDetails.name
    const price = gameDetails.price_overview
      ? gameDetails.is_free
      ? 'is free-to-play'
      : `costs ${gameDetails.price_overview.final_formatted}`
      : ''
    const age = gameDetails.required_age > 0
      ? 'Rated ' + gameDetails.required_age + '+.'
      : 'Rated E for everyone.'
    const releaseDate = gameDetails.release_date.date
      ? gameDetails.release_date.coming_soon
      ? gameDetails.release_date.date == 'TBA'
      ? 'To Be Announced'
      : gameDetails.release_date.date
      : gameDetails.release_date.date
      : '(No Release Date Provided)'
    return {
      success: true,
      reply: `${game} ${price} on Steam. ${age} Released/Releasing: ${releaseDate}. Game link: https://store.steampowered.com/app/${id}`
    }
  } catch (e) {
    return {
      success: false,
      reply: `${e} | Use: "${context.prefix}game {channel}" to look up games that a specific channel is playing.`
    }
  }
}