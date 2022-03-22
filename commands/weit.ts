import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Please provide an emote or emote code/id to look up. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', '😵', '⛔'])}`
		}
	}
  let query = context.args[0]
	let isEmoteID = /^\d+$/.test(query) || /emotesv2_[a-z0-9]{32}/.test(query)
  let isEmoteLink = /https:\/\/static\-cdn\.jtvnw\.net\/emoticons\/v2\/\S+\/default\/dark\/[1-5]\.0/.test(query)
  if (isEmoteLink) {
    query = query.replace('https://static-cdn.jtvnw.net/emoticons/v2/', '').replace(/\/default\/dark\/[1-5]\.0/, '')
    isEmoteID = true
  }
	try {
		const emoteData = await utils.fetch(`https://api.ivr.fi/v2/twitch/emotes/${query}?id=${String(isEmoteID)}`)
    const sourceType = emoteData.emoteType == 'GLOBALS'
      ? 'global Twitch emote.'
      : emoteData.emoteType == 'SUBSCRIPTIONS'
      ? `Tier ${emoteData.emoteTier} subscriber emote to the channel @${emoteData.channelLogin}`
      : emoteData.emoteType == 'FOLLOWER'
      ? `follower emote to the channel @${emoteData.channelLogin}`
      : emoteData.emoteType == 'SMILIES'
      ? `Twitch smiley emote.`
      : `(Unknown Emote Type)`
    const emoteLink = `Emote Link: https://static-cdn.jtvnw.net/emoticons/v2/${emoteData.emoteID}/default/dark/3.0`
    const authorLink = emoteData.emoteType == 'SUBSCRIPTIONS' || emoteData.emoteType == 'FOLLOWER'
      ? `Author Emotes Link: https://emotes.raccatta.cc/twitch/${emoteData.channelLogin}`
      : ''
    return {
      success: true,
      reply: `${emoteData.emoteCode} (ID: ${emoteData.emoteID}) is a ${emoteData.emoteAssetType.toLowerCase()} ${sourceType} ${emoteLink} ${authorLink}`
    }
	} catch (err) {
		return {
			success: false,
			reply: err
		}
	}
}