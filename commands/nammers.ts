import utils from '../utils'

module.exports = async (client, context) => {
  const target = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
  const nammers = await utils.getData(`${target}Nammers`)
  const address = target == context.user ? { pronoun: `You`, info: `Use "${context.prefix}hunt" to get more.` } : { pronoun: `They`, info: `` }
  if(!nammers || +nammers == 0) { return { success: true, reply: `${address.pronoun} don't have any nammers! ${address.info}` } }
  return { success: true, reply: `${address.pronoun} have ${nammers} nammers! ${address.info}` }
}