import utils from '../utils'

module.exports = async (client, context) => {
  return { success: true, reply: context.args[0] ? `https://www.frankerfacez.com/emoticons/?q=${context.args[0]}&sort=count-desc&days=0` : `Provide an emote to look up.`}
}