import utils from '../utils'

module.exports = async (client, context) => {
  if(!await utils.checkAdmin(context.user)) {
    return {
      success: false,
      return: `You don't have permission to use that command! Required: Admin`
    }
  }
  const timeCheck = context.args.join(' ').match(/(time|duration|for)(:|=)(\d+)/i)
  var from = timeCheck ? +timeCheck[3] * 1000
    : 30 * 1000
  if (timeCheck) {
    context.args.splice(context.args.indexOf(timeCheck[0]), 1)
  }
  if(!context.args[0]) {
    return {
      success: false,
      reply: `Provide a channel to temporarily join.`
    }
  }
  const target = context.args[0].toLowerCase().replace('@', '')
  if(utils.getChannels().indexOf(target) != -1) {
    return {
      success: false,
      reply: `I'm already in that channel!`
    }
  }
  if(from > 600000 || from < 10000) {
    return {
      success: false,
      reply: `You can only join a channel for 10 seconds to 10 minutes.`
    }
  }
  client.join(target)
  client.me(target, `I have temporarily joined this channel for ${Math.round(from/1000)} seconds.`)
  client.me(context.channel, `Joined #${target} for ${Math.round(from/1000)} seconds.`)
  setTimeout(() => {
    client.me(target, `ppPoof 👋`)
    client.me(context.channel, `ppPoof left #${target}`)
    client.part(target)
  }, from)
}