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
  if (context.emotes[0]) {
    query = context.emotes[0].id
    isEmoteID = true
  }
  try {
    const emoteData = await utils.fetch(`https://api.ivr.fi/v2/twitch/emotes/${query}?id=${String(isEmoteID)}`)
    const sourceType = emoteData.emoteType == 'GLOBALS'
      ? 'global Twitch emote.'
      : emoteData.emoteType == 'SUBSCRIPTIONS'
      ? emoteData.channelLogin
      ? `Tier ${emoteData.emoteTier} subscriber emote to the channel @${emoteData.channelLogin}`
      : `Tier ${emoteData.emoteTier} subscriber emote to an unknown/deleted channel.`
      : emoteData.emoteType == 'FOLLOWER'
      ? `follower emote to the channel @${emoteData.channelLogin}`
      : emoteData.emoteType == 'SMILIES'
      ? `Twitch smiley emote.`
      : emoteData.emoteType == 'BITS_BADGE_TIERS'
      ? emoteData.channelLogin
      ? ` Bit emote that costs ${emoteData.emoteBitCost} Bits to the channel @${emoteData.channelLogin}`
      : ` Bit emote that costs ${emoteData.emoteBitCost} Bits to an unknown/deleted channel.`
      :`(Unknown Emote Type)`
    const emoteLink = `Emote Link: https://emotes.raccatta.cc/twitch/emote/${emoteData.emoteID}`
    const authorLink = emoteData.emoteType == 'SUBSCRIPTIONS' || emoteData.emoteType == 'FOLLOWER'
      ? emoteData.channelLogin
      ? `Author Emotes Link: https://emotes.raccatta.cc/twitch/${emoteData.channelLogin}`
      : ''
      : ''
    return {
      success: true,
      reply: `${emoteData.emoteCode} (ID: ${emoteData.emoteID}) is a ${emoteData.emoteAssetType.toLowerCase()} ${sourceType} ${emoteLink} ${authorLink}`
    }
  } catch (err) {
    if (err == 'Error: Not Found') {
      return {
        success: false,
        reply: `That emote wasn't valid! Use the emote's url instead. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', '😵', '⛔'])}`
      }
    }
    return {
      success: false,
      reply: err
    }
  }
}