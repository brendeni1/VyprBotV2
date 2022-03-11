import utils from '../utils'

module.exports = async (client, context) => {
  client.me(context.channel, `👥 ${context.args.join(' ')}`)
}