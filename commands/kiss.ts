import utils from '../utils'

module.exports = async (client, context) => {
  if(!context.args[0]) { return { success: false, reply: `Provide a target.` } }
  const target = context.args[0].replace('@', '')
  context.args.shift()
  const message = context.args[0]
    ? context.args.join(' ')
    : `${await utils.bestEmote(context.channel, ['catKISS', 'KissAWeeb', 'FumoKiss', 'Kissaweeb', 'KissAHomie', 'CatAHomie', '💋', '😘'])} 💘`
  if (target.toLowerCase() == context.user) {
    const message = context.args[0]
    ? context.args.join(' ')
    : await utils.bestEmote(context.channel, ['catKISS', 'KissAWeeb', 'FumoKiss', 'KissAHomie', 'kissaHOMIE', 'Kissa2hu', 'CatAHomie', '💋', '😘']) + ' 💘'
    return {
      success: true,
      reply: `You kys.. kiss yourself: ${message} `
    }
  }
  return { success: true, reply: `${context.display} kisses ${target} on the cheek: ${message}` }
}