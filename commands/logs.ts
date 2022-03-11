import utils from '../utils'

module.exports = async (client, context) => {
  const [user, channel] = [context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user, context.args[1] ? context.args[1].toLowerCase().replace('@', '') : context.channel]
  return { success: true, reply: `https://logs.ivr.fi/?channel=${channel}&username=${user}` }
}