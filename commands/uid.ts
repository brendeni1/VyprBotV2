import utils from '../utils'

module.exports = async (client, context) => {
  const uidCheck = context.args.join(' ').match(/uid(:|=)(true|false)/i)
  const id = uidCheck ? Boolean(uidCheck[2].toLowerCase()) : false
  if (uidCheck) { context.args.splice(context.args.indexOf(uidCheck[0]), 1) }
  const chatter = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
  try {
    const chatterData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${chatter}?id=${id}`)
    const uid = chatterData.banned ? `UID: ${chatterData.id} ⛔ (${chatterData.banReason})` : `UID: ${chatterData.id}`
    return {
      success: true,
      reply: `User: @${chatterData.displayName} | ${uid}`
    }
  }catch(e) {
    return {
      success: false,
      reply: e
    }
  }
}