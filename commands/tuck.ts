import utils from '../utils'

module.exports = async (client, context) => {
  if(!context.args[0]) { return { success: false, reply: `Provide a target.` } }
  const target = context.args[0].replace('@', '')
  context.args.shift()
  const message = context.args[0]
    ? context.args.join(' ')
    : await utils.bestEmote(context.channel, ['catKISS', 'KissAWeeb', 'FumoKiss', 'FumoTuck', 'SoCute', 'HUGGIES', 'Tuckacutie', 'CatAHomie', '🛌', '😴']) + ' 💝'
  if (target.toLowerCase() == context.user) {
    const message = context.args[0]
    ? context.args.join(' ')
    : await utils.bestEmote(context.channel, ['tiredCat', 'FeelsBadMan', 'Sadge', 'FAINT', 'BRUHFAINT', 'BruhFaint', 'peepoSad', '🛌', '😴'])
    return {
      success: true,
      reply: `You don't have anyone to tuck you into bed, so you tuck yourself... ${message} 💤`
    }
  }
  return { success: true, reply: `${context.display} tucks ${target} into bed: ${message}` }
}