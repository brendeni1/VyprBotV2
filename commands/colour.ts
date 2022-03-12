import utils from '../utils'

module.exports = async (client, context) => {
  const colours = ['red', 'blue', 'green', 'firebrick', 'coral', 'yellowgreen', 'orangered', 'seagreen', 'goldenrod', 'chocolate', 'cadetblue', 'dodgerblue', 'hotpink', 'blueviolet', 'springgreen']
  if (!context.args[0] || colours.indexOf(context.args[0].toLowerCase())) { return { success: false, reply: `Invalid colour! Colours: ${colours.join(', ')}` } }
  let nammers = await utils.getData(`${context.user}Nammers`)
  if (!nammers || +nammers == 0) {
    return { success: false, reply: `You don't have any nammers! Use "${context.prefix}hunt" to get some.` }
  }
  nammers = +nammers
  if (nammers < 200) {
    return { success: false, reply: `You don't have enough nammers! You need 200 nammers, but only have ${nammers}. Use "${context.prefix}hunt" to get some more.` }
  }
  const win = utils.randInt(0, 1) == 0
  if(win) {
    utils.setData(`${context.user}Nammers`, nammers + amount)
    return { success: true, reply: `You won ${amount} nammer${amount==1?'':'s'}! You now have ${nammers + amount}.` }
  }
  utils.setData(`${context.user}Nammers`, nammers - amount)
  return { success: true, reply: `You lost ${amount} nammer${amount==1?'':'s'}! You now have ${nammers - amount}.` }
}