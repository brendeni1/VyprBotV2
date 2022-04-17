import utils from '../utils'

module.exports = async (client, context) => {
  const channel = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.channel
  try {
    await utils.userExists(channel)
    return { success: true, reply: `https://emotes.raccatta.cc/twitch/${channel}` }
  } catch (e) {
    if (e == 'Error: Not Found') {
  		return {
  			success: false,
  			reply: `That emote wasn't valid! Use the emote's url instead. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', '😵', '⛔'])}`
  		}
    }
    return {
      success: false,
      reply: e
    }
  }
}