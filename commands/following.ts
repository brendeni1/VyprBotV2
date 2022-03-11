import utils from '../utils'

module.exports = async (client, context) => {
  const user = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
  return { success: true, reply: `Visit: https://www.twitchfollowing.com/?${user} for a list of people that @${user} is following.` }
}