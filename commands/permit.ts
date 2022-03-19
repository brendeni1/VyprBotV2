import utils from '../utils'

module.exports = async (client, context) => {
  if (!await utils.checkAdmin(context.user) && context.user != context.channel) {
    return {
      success: false,
      reply: `You don't have the required permission to perform that command! Required: Channel Broadcaster or Above.`
    }
  }
  const options = ['add', 'remove', 'delete', 'check']
  if (!context.args[0] || options.indexOf(context.args[0]) == -1 || !context.args[1]) {
    return {
      success: false,
      reply: `Invalid Syntax! Example: "${context.prefix}permit {add|delete|remove|check} {user}"`
    }
  }
  let permits = await utils.getData(`${context.channel}Permits`)
  if (!permits) {
    await utils.setData(`${context.channel}Permits`, context.channel)
    permits = context.channel
  }
  permits = permits.split(' ')
  let [action, target] = [context.args[0].toLowerCase(), context.args[1].replace('@', '').toLowerCase()]
  if (await utils.checkAdmin(target)) {
    return {
      success: false,
      reply: 'That user is an admin, you cannot modify their permissions.'
    }
  }
  if (action == 'add') {
    if (permits.indexOf(target) != -1) {
      return {
        success: false,
        reply: 'That user is alredy permitted in this channel!'
      }
    }
    permits.push(target)
    utils.setData(`${context.channel}Permits`, permits.join(' '))
    return {
      success: true,
      reply: `Successfully permitted @${target} in #${context.channel}`
    }
  }
  if (action == 'delete' || action == 'remove') {
    if (permits.indexOf(target) == -1) {
      return {
        success: false,
        reply: 'That user is not permitted in this channel!'
      }
    }
    permits.splice(permits.indexOf(target), 1)
    utils.setData(`${context.channel}Permits`, permits.join(' '))
    return {
      success: true,
      reply: `Successfully removed @${target}'s permissions in #${context.channel}`
    }
  }
  if (action == 'check') {
    if (target == context.channel) {
      return {
        success: true,
        reply: `Channel broadcasters are automatically permitted!`
      }
    }
    return permits.indexOf(target) == -1 ? {
      success: true,
      reply: `@${target} is not permitted in #${context.channel} ❌`
    } : {
      success: true,
      reply: `@${target} is permitted in #${context.channel} ✅`
    }
  }
}