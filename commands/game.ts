import utils from '../utils'
import steamID from 'appid'
import SteamAPI from 'steamapi'
const steam = new SteamAPI(process.env.STEAM_API_KEY)

module.exports = async (client, context) => {
  const channelCheck = context.args.join(' ').match(/channel(=|:)(\w+)/i)
  let channel = channelCheck ? channelCheck[2] : null
  try {
    var game
    var user_login
    if (channel) {
      const channelData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${channel}`)
      let streamData = await utils.streamDetails(channel)
      if (!streamData.data[0]) {
        return {
          success: false,
          reply: `I can only lookup games for channels that are live!`
        }
      }
      streamData = streamData.data[0]
      if (!streamData.game_name) {
        return {
          success: false,
          reply: `${channel} has not yet set their game!`
        }
      }
      const blacklistedGames = ['Music', 'Just Chatting', 'Art', 'Pools, Hot Tubs, and Beaches', 'Talk Shows & Podcasts', 'ASMR', 'Retro', 'Sports', 'Games + Demos', 'Slots', 'Makers & Crafting', 'Food & Drink', 'Software and Game Development', 'Politics', 'Travel & Outdoors', 'Fitness & Health', 'Animals, Aquariums, and Zoos']
      if (blacklistedGames.indexOf(streamData.game_name) != -1) {
        return {
          success: false,
          reply: `"${streamData.game_name}" is blacklisted because It's a category, not a game.`
        }
      }
      game = streamData.game_name
      user_login = streamData.user_name
    }
    else {
      game = context.args.join(' ')
    }
    let gameRegex = new RegExp('^' + game + '$', 'i')
    let id = await steamID(gameRegex)
    if (!id[0] && channel) {
      return {
        success: true,
        reply: `${user_login} is playing ${game}. No Steam link available.`
      }
    }
    if (!id[0]) {
      return {
        success: true,
        reply: `No Steam data could be found with that name. Try re-formatting or re-phrasing.`
      }
    }
    id = id[0].appid
    let gameDetails = await steam.getGameDetails(id)
    game = gameDetails.name
    const [price, age] = [gameDetails.price_overview ? gameDetails.is_free ? 'is free-to-play' : `costs ${gameDetails.price_overview.final_formatted}` : '', gameDetails.required_age > 0 ? 'Rated ' + gameDetails.required_age + '+.' : '']
    const releaseDate = gameDetails.release_date.coming_soon ? gameDetails.release_date.date == 'TBA' ? 'Release is to be announced.' : `Releases on ${utils.formatDate(gameDetails.release_date.date, 'longDate')} (in ${utils.formatDelta(gameDetails.release_date.date)})` : `Released on ${utils.formatDate(gameDetails.release_date.date, 'longDate')} (${utils.formatDelta(gameDetails.release_date.date)} ago)`
    const channelString = channel ? `${user_login}'s game,` : ''
    return {
      success: true,
      reply: `${channelString} ${game} ${price} on Steam. ${age} ${releaseDate} Game link: https://store.steampowered.com/app/${id}`
    }
  } catch (e) {
    return {
      success: false,
      reply: e
    }
  }
}