import utils from '../utils'

module.exports = async (client, context) => {
  return { success: true, reply: context.args[0] ? `https://betterttv.com/emotes/shared/search?query=${context.args[0]}` : `Provide an emote to look up.`}
}