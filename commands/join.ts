import utils from '../utils'
import fs from 'fs-extra'

module.exports = async (client, context) => {
  if(!await utils.checkAdmin(context.user)) { return { success: false, reply: `You don't have permission to use that command! Required: Admin` } }
  if(!context.args[0]) { return { success: false, reply: `Please provide a channel to join.` } }
  const silentCheck = context.args.join(' ').match(/silent(:|=)(true|false)/i)
  silent = silentCheck ? Boolean(silentCheck[2]) : false; if(silentCheck) { context.args.splice(context.args.indexOf(silentCheck[0]), 1) }
  const [channels, target] = [await utils.getChannels(), context.args[0].toLowerCase().replace('@', '')]
  if(channels.indexOf(target) != -1) { return { success: false, reply: `Channel already joined!` } }
  channels.push(target)
  await fs.writeFile('db/channels.txt', channels.join(' '))
  client.join(target)
  if(!silent) { client.me(target, `Successfully Joined 👋`) }
  return { success: true, reply: `Successfully joined #${target} TehePelo` }
}