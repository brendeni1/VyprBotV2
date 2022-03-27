import utils from '../utils'

module.exports = async (client, context) => {
  try {
    let userData = await utils.fetch(`https://api.7tv.app/v2/users/${context.args[0] ?? context.user}`)
    return { success: true, reply: `Login: ${userData.login} | 7tv ID: ${userData.id} | Link: https://7tv.app/users/${userData.id} ` }
  }catch(e) {
    return { success: false, reply: `Error: ${e.message}` }
  }
}