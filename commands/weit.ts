import utils from '../utils'

module.exports = async (client, context) => {
  if (!context.args[0]) { return { success: false, reply: 'Please provide an emote or emote code/id to look up.' } }
  const isEmoteID = /^\d+$/.test(context.args[0]) || /emotesv2_[a-z0-9]{32}/.test(context.args[0])
  try {
    const emoteData = await utils.fetch(`https://api.ivr.fi/v2/twitch/emotes/${context.args[0]}?id=${String(isEmoteID)}`)
    if (emoteData.emoteType == 'GLOBALS') {
      return { success: true, reply: `${emoteData.emoteCode} (ID: ${emoteData.emoteID}) is a ${emoteData.emoteAssetType.toLowerCase()} global Twitch emote. Emote Link: ${emoteData.emoteURL.replace('dark/1.0', 'dark/3.0')}` }
    }
    if (emoteData.emoteType == 'SUBSCRIPTIONS') {
      return { success: true, reply: `${emoteData.emoteCode} (ID: ${emoteData.emoteID}) is a ${emoteData.emoteAssetType.toLowerCase()} Tier ${emoteData.emoteTier} subscriber emote to the channel @${emoteData.channelName} ( @${emoteData.channelLogin} ). Emote Link: ${emoteData.emoteURL.replace('dark/1.0', 'dark/3.0')}` }
    }
    if (emoteData.emoteType == 'FOLLOWER') {
      return { success: true, reply: `${emoteData.emoteCode} (ID: ${emoteData.emoteID}) is a ${emoteData.emoteAssetType.toLowerCase()} follower emote to the channel @${emoteData.channelName} ( @${emoteData.channelLogin} ). Emote Link: ${emoteData.emoteURL.replace('dark/1.0', 'dark/3.0')}` }
    }
    if (emoteData.emoteType == 'SMILIES') {
      return { success: true, reply: `${emoteData.emoteCode} (ID: ${emoteData.emoteID}) is a ${emoteData.emoteAssetType.toLowerCase()} Twitch smiley emote. Emote Link: ${emoteData.emoteURL.replace('dark/1.0', 'dark/3.0')}` }
    }
  }
  catch (err) {
    return { success: false, reply: err }
  }
}