import utils from '../utils'

module.exports = async (client, context) => {
  let [targetUser, targetChannel] = [context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user, context.args[1] ? context.args[1].toLowerCase().replace('@', '') : context.channel]
  try {
    let subDetails = await utils.fetch(`https://api.ivr.fi/twitch/subage/${targetUser}/${targetChannel}`)
    let [hidden, user, channel, subStatus, subType, subTier, giftData, months, streak] = [subDetails.hidden, subDetails.username, subDetails.channel, subDetails.subscribed, subDetails.meta.type, subDetails.meta.tier, subDetails.meta.gift, subDetails.cumulative.months, subDetails.streak.months]
    let remainingOnActiveSub = utils.formatDelta(subDetails.meta.endsAt)
    let timeSinceSubEnded = utils.formatDelta(subDetails.cumulative.end)
    if (hidden) { return { success: true, reply: `@${user} has hidden their subscription status, or the target channel (#${channel}) is not an affiliate!` } }
    if (months == 0) { return { success: true, reply: `@${user} has never been subbed to @${channel}.` } }
    if (!subStatus && months != 0) { return { success: true, reply: `@${user} isn't currently subbed to @${channel} but they have previously. They were subbed for ${months} month(s) and their sub expired ${timeSinceSubEnded} ago.` } }
    if (subTier == 'Custom') { return { success: true, reply: `@${user} is currently subbed to @${channel} with a permanent sub! They have been subbed for ${months} month(s).` } }
    if (subTier == 3 && !subDetails.meta.endsAt) { return { success: true, reply: `@${user} is currently subbed to @${channel} with a permanent sub! They have been subbed for ${months} month(s).` } }
    if (subType == 'paid') { return { success: true, reply: `@${user} is currently subbed to @${channel} with a tier ${subTier} paid sub! They have been subbed for ${months} month(s) and are on a ${streak} month streak. Their sub expires/renews in ${remainingOnActiveSub}.` } }
    if (subType == 'prime') { return { success: true, reply: `@${user} is currently subbed to @${channel} with a free Twitch Prime sub! They have been subbed for ${months} month(s) and are on a ${streak} month streak. Their sub expires/renews in ${remainingOnActiveSub}.` } }
    if (subType == 'gift') { return { success: true, reply: `@${user} is currently subbed to @${channel} with a tier ${subTier} gift sub by @${giftData.name}! They have been subbed for ${months} month(s) and are on a ${streak} month streak. Their sub expires/renews in ${remainingOnActiveSub}.` } }
  }
  catch (err) {
    return { success: false, reply: err }
  }
}