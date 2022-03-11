import utils from '../utils'

module.exports = async (client, context) => {
  try {
    const idCheck = context.args.join(' ').match(/(uid|lookup)(:|=)(true|false)/i)
    const id = idCheck ? Boolean(idCheck[2].toLowerCase()) : false; if (idCheck) { context.args.splice(context.args.indexOf(idCheck[0]), 1) }
    user = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
    const userData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${user}?id=${id}`)
    return { success: true, reply: `Name: ${userData.login} | Date: ${utils.formatDate(userData.createdAt, 'fullDate')} | Time since then: ${utils.formatDelta(userData.createdAt)}.` }
  }catch(e) {
    return { success: false, reply: e }
  }
}