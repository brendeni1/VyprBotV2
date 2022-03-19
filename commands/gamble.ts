import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0] || !/(^\d+$)|(^all$)/i.test(context.args[0])) {
		return {
			success: false,
			reply: `Invalid syntax! Usage: "${context.prefix}gamble {number}"`
		}
	}
	let [nammers, amount] = [await utils.getData(`${context.user}Nammers`), context.args[0].toLowerCase()]
	if (!nammers || +nammers == 0) {
		return {
			success: false,
			reply: `You don't have any nammers! Use "${context.prefix}hunt" to get some.`
		}
	}
	amount = amount == 'all' ? nammers : +amount
	nammers = +nammers
	if (nammers < amount) {
		return {
			success: false,
			reply: `You don't have enough nammers! Use "${context.prefix}hunt" to get some. You have ${nammers} nammers.`
		}
	}
	const win = utils.randInt(0, 1) == 0
	if (win) {
		utils.setData(`${context.user}Nammers`, nammers + amount)
		return {
			success: true,
			reply: `You won ${amount} nammer${amount==1?'':'s'}! You now have ${nammers + amount}.`
		}
	}
	utils.setData(`${context.user}Nammers`, nammers - amount)
	return {
		success: true,
		reply: `You lost ${amount} nammer${amount==1?'':'s'}! You now have ${nammers - amount}.`
	}
}