import utils from '../utils'

module.exports = async (client, context) => {
  return { success: true, reply: `I am in ${utils.getChannels().length} channels! | Channel List: http://channels.darkvypr.com/ | Use "${context.prefix}request" for help on getting the bot in your chat!` }
}