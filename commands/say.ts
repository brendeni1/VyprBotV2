import utils from '../utils'

module.exports = async (client, context) => {
  if(!context.args[0]) { return { success: false, reply: `Please provide a phrase to echo back. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}` } }
  return { success: true, reply: `👥 ${context.args.join(' ')}` }
}