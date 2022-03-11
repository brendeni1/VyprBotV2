import utils from '../utils'

module.exports = async (client, context) => {
    const [user, channel] = [context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user, context.args[1] ? context.args[1].toLowerCase().replace('@', '') : context.channel]
    try {
      const followData = await utils.fetch(`https://api.ivr.fi/twitch/subage/${user}/${channel}`)
      if (!followData.followedAt) { return { success: true, reply: `${followData.username} is not following ${followData.channel}.` } }
      const [followDelta, followDate] = [utils.formatDelta(followData.followedAt), utils.formatDate(followData.followedAt, "fullDate")]
      return { success: true, reply: `@${followData.username} followed @${followData.channel} on ${followDate} which was ${followDelta} ago.` }
    }catch(e) {
      return { success: false, reply: e }
    }
}