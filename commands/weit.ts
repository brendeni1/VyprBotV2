import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: false,
			reply: 'Please provide an emote or emote code/id to look up.'
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
		if (emoteData.emoteType == 'GLOBALS') {
			return {
				success: true,
				reply: `${emoteData.emoteCode} (ID: ${emoteData.emoteID}) is a ${emoteData.emoteAssetType.toLowerCase()} global Twitch emote. Emote Link: https://static-cdn.jtvnw.net/emoticons/v2/${emoteData.emoteID}/default/dark/3.0`
			}
		}
		if (emoteData.emoteType == 'SUBSCRIPTIONS') {
			return {
				success: true,
				reply: `${emoteData.emoteCode} (ID: ${emoteData.emoteID}) is a ${emoteData.emoteAssetType.toLowerCase()} Tier ${emoteData.emoteTier} subscriber emote to the channel @${emoteData.channelName} ( @${emoteData.channelLogin} ). Emote Link: https://static-cdn.jtvnw.net/emoticons/v2/${emoteData.emoteID}/default/dark/3.0`
			}
		}
		if (emoteData.emoteType == 'FOLLOWER') {
			return {
				success: true,
				reply: `${emoteData.emoteCode} (ID: ${emoteData.emoteID}) is a ${emoteData.emoteAssetType.toLowerCase()} follower emote to the channel @${emoteData.channelName} ( @${emoteData.channelLogin} ). Emote Link: https://static-cdn.jtvnw.net/emoticons/v2/${emoteData.emoteID}/default/dark/3.0`
			}
		}
		if (emoteData.emoteType == 'SMILIES') {
			return {
				success: true,
				reply: `${emoteData.emoteCode} (ID: ${emoteData.emoteID}) is a ${emoteData.emoteAssetType.toLowerCase()} Twitch smiley emote. Emote Link: https://static-cdn.jtvnw.net/emoticons/v2/${emoteData.emoteID}/default/dark/3.0`
			}
		}
	} catch (err) {
		return {
			success: false,
			reply: err
		}
	}
}