import utils from '../utils'

module.exports = async (client, context) => {
  if (context.args.length < 2) { return { success: false, reply: `Please specify at least 2 items to pick from! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}` } }
  return { success: true, reply: utils.randArrayElement(context.args) }
}