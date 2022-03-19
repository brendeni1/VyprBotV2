import utils from '../utils'

module.exports = async (client, context) => {
  const topCheck = context.args.join(' ').match(/top(:|=)(\d+)/i)
  const top = topCheck ? +topCheck[2] : 10
  if (topCheck) {
    context.args.splice(context.args.indexOf(topCheck[0]), 1)
  }
  if (top < 1) {
    return {
      success: false,
      reply: `You cannot get the top ${top} games on Twitch. :p`
    }
  }
  try {
    let topGames = await utils.topGames()
    if(!topGames.data[0]) {
      return {
        success: false,
        reply: `The Twitch API isn't functioning correctly. Try again later.`
      }
    }
    let gamesArray = []
    topGames = topGames.data.forEach(gameDetails => gamesArray.push(gameDetails.name))
    gamesArray = gamesArray.slice(0, top)
    return {
      success: true,
      reply: `Top ${gamesArray.length} game${gamesArray.length > 1 ? 's' : ''} on Twitch right now ${gamesArray.length > 1 ? 'are' : 'is'}: ${gamesArray.join(', ')}`
    }
  } catch (e) {
    return {
      success: false,
      reply: `There was an error getting the top Twitch games! (${e})`
    }
  }
}