import utils from '../utils'

module.exports = async (client, context) => {
  if(!await utils.checkAdmin(context.user) && context.channel != 'darkvypr') {
    return { success: false, reply: `This command is only availabe in #darkvypr's channel, or globally to admins!` }
  }
  return { success: true, reply: `Sub pls AYAYAsmile http://yt.darkvypr.com` }
}