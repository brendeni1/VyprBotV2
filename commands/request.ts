import utils from '../utils'

module.exports = async (client, context) => {
  return { success: true, reply: `If you'd like this bot added to your chat, use: "${context.prefix}join". To remove the bot, use: "${context.prefix}part".` }
}