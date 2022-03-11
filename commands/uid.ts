import utils from '../utils'

module.exports = async (client, context) => {
  const chatter = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
  const chatterData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${chatter}`)
  const uid = chatterData.banned ? `${chatterData.id} (Banned User ⛔ )` : chatterData.id
  return { success: true, reply: `User: @${chatterData.displayName} | UID: ${uid}` }
}