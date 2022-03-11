import utils from '../utils'

module.exports = async (client, context) => {
  const user = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
  return { success: true, reply: `https://twitch-tools.rootonline.de/followerlist_viewer.php?channel=${user} for a list of people that follow @${user} NOTED` }
}