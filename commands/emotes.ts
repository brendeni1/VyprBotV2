import utils from '../utils'

module.exports = async (client, context) => {
  const channel = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.channel
  return { success: true, reply: `https://emotes.raccatta.cc/twitch/${channel}` }
}