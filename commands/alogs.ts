import utils from '../utils'

module.exports = async (client, context) => {
  return { success: true, reply: `https://logs.apulxd.ga/?channel=${context.args[1] ?? context.channel}&username=${context.args[0] ?? context.user}` }
}