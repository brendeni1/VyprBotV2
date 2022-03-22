import utils from '../utils'

module.exports = async (client, context) => {
  const allowedChannels = ['darkvypr', 'visioisiv', 'gotiand']
  if(!await utils.checkAdmin(context.user) && allowedChannels.indexOf(context.channel) == -1) {
    return { success: false, reply: `This command is only availabe in these channels: ${allowedChannels.join(', ')}, or globally to admins! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}` }
  }
  return { success: true, reply: `Join the homie server TriHard 👉 http://idiotas.darkvypr.com` }
}