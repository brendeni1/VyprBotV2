import utils from '../utils'

module.exports = async (client, context) => {
  try {
    let target = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
    let userData = await utils.fetch(`https://api.7tv.app/v2/users/${target}`)
    return { success: true, reply: `Login: ${userData.login} | 7tv ID: ${userData.id} | Link: https://7tv.app/users/${userData.id} ` }
  }catch(e) {
    return { success: false, reply: `Error: ${e.message}` }
  }
}