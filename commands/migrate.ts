import utils from '../utils'
import Database from "@replit/database"
const oldData = new Database(process.env.OLD_DATABASE)

module.exports = async (client, context) => {
  try {
    if (!await utils.checkAdmin(context.user)) { return { success: false, reply: `You don't have permission to use that command! Required: Admin` } }
    if (!context.args[0]) { return { success: false, reply: `Invalid syntax! Usage: "${context.prefix}migrate {user}"` } }
    const user = context.args[0].toLowerCase().replace('@', '')
    const oldNammers = await oldData.get(`${user}nammers`)
    if(!oldNammers) { return { success: false, reply: `That user didn't have any nammer data.` } }
    utils.setData(`${user}Nammers`, +oldNammers)
    return { success: false, reply: `Transfered ${oldNammers} of @${user}'s nammers to v2.` }
  }catch(e) {
    return {
      success: false,
      reply: `${e}, try refreshing the old database url.`
    }
  }
}