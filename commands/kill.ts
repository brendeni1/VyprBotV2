import utils from '../utils'

module.exports = async (client, context) => {
  if (!context.args[0] || !/(^\d+$)|(^all$)/i.test(context.args[0])) { return { success: false, reply: `Invalid syntax! Usage: "${context.prefix}kill {number}"` } }
  let [nammers, amount] = [await utils.getData(`${context.user}Nammers`), context.args[0].toLowerCase()]
  if (!nammers || +nammers == 0) {
    return { success: false, reply: `You don't have any nammers! Use "${context.prefix}hunt" to get some.` }
  }
  amount = amount == 'all' ? nammers : +amount
  nammers = +nammers
  if (nammers < amount) {
    return { success: false, reply: `You don't have enough nammers! Use "${context.prefix}hunt" to get some. You have ${nammers} nammers.` }
  }
  const message = amount >= 1 && amount < 20 ? `You line ${amount} nammer${amount == 1 ? '' : 's'} up in front of a firing squad, and are left with ${nammers - amount}.`
    : amount >= 20 && amount < 50 ? `You send ${amount} nammers off to a volcano, and are left with ${nammers - amount}.`
      : amount >= 50 && amount < 80 ? `You drop a car on ${amount} nammers killing them, and are left with ${nammers - amount}.`
        : amount >= 80 && amount < 120 ? `You stab ${amount} nammers one-by-one, and are left with ${nammers - amount}.`
          : amount >= 120 && amount < 200 ? `You lethally inject ${amount} nammers with rat poison, and are left with ${nammers - amount}.`
            : amount >= 200 && amount < 250 ? `You fatally electrocute ${amount} nammers one-by-one, make the others watch, and are left with ${nammers - amount}.`
              : amount >= 250 && amount < 1000 ? `You make ${amount} nammers jump off of a building in a single file line, and are left with ${nammers - amount}.`
                : `You enlist ${amount} nammers into the VietNaM war, and are left with ${nammers - amount}.`
  nammers = nammers - amount
  utils.setData(`${context.user}Nammers`, nammers)
  return { success: true, reply: message }
}