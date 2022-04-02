import utils from '../utils'

module.exports = async (client, context) => {
	const channelCheck = context.args.join(' ').match(/channel(:|=)(\w+)/i)
	var channel = channelCheck ? channelCheck[2] : context.channel;
	if (channelCheck) {
		context.args.splice(context.args.indexOf(channelCheck[0]), 1)
	}
  if(!context.args[0]) {
    return {
      success: false,
      reply: `Please provide a word to search emotes in #${channel} with. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
    }
  }
  try {
    let searchRegex = new RegExp(context.args[0], 'i')
    let emotes = await utils.getChannelEmotes(channel)
    if(!emotes) {
      return {
        success: false,
        reply: `#${channel} has no emotes in their channel! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
      }
    }
    let matches = emotes.filter(i => {
      return i.match(searchRegex)
    })
    if(!matches[0]) {
      return {
        success: true,
        reply: `No emotes matching that term! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
      }
    }
    return {
      success: true,
      reply: matches.join(' ')
    }
  } catch (e) {
    return {
      success: false,
      reply: `${e} ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
    }
  }
}