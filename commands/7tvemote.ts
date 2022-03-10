import utils from '../utils'

module.exports = async (client, context) => {
  return { success: true, reply: context.args[0] ? `https://7tv.app/emotes?sortBy=popularity&page=0&query=${context.args[0]}` : `Provide an emote to look up.` }
}