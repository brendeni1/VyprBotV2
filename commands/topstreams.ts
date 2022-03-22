import utils from '../utils'

module.exports = async (client, context) => {
  const topCheck = context.args.join(' ').match(/top(:|=)(\d+)/i)
  const top = topCheck ? +topCheck[2] : 5
  if (topCheck) {
    context.args.splice(context.args.indexOf(topCheck[0]), 1)
  }
  if (top < 1) {
    return {
      success: false,
      reply: `You cannot get the top ${top} streams on Twitch. :p`
    }
  }
  try {
    let topStreams = await utils.topStreams()
    if(!topStreams.data[0]) {
      return {
        success: false,
        reply: `The Twitch API isn't functioning correctly. Try again later. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
      }
    }
    topStreams = topStreams.data.slice(0, top)
    let topStreamsArray = []
    topStreams.forEach(streamData => topStreamsArray.push(`${streamData.user_name} playing ${streamData.game_name ? streamData.game_name : '(No Game Set)'} for ${streamData.viewer_count} people`))
    return {
      success: true,
      reply: `Top ${topStreams.length} stream${topStreams.length > 1 ? 's' : ''} on Twitch right now ${topStreams.length > 1 ? 'are' : 'is'}: ${topStreamsArray.join(' | ')}`
    }
  } catch (e) {
    return {
      success: false,
      reply: `There was an error getting the top Twitch games! (${e}) ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
    }
  }
}