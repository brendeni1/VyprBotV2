import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0] || !context.args[1] || !/(^\d+$)|(^all$)/.test(context.args[1])) {
		return {
			success: false,
			reply: `Invalid syntax! Usage: "${context.prefix}give {user} {amount}"`
		}
	}
	let [target, amount] = [context.args[0].toLowerCase().replace('@', ''), context.args[1].toLowerCase()]
	if (target == context.user) {
		return {
			success: false,
			reply: `You cannot give nammers to yourself!`
		}
	}
	if (amount == 0) {
		return {
			success: false,
			reply: `You cannot give 0 nammers!`
		}
	}
	let [senderNammers, targetNammers] = [await utils.getData(`${context.user}Nammers`), await utils.getData(`${target}Nammers`)]
	if (!senderNammers || +senderNammers == 0) {
		return {
			success: false,
			reply: `You don't have any nammers! Use: "${context.prefix}hunt" to get some.`
		}
	}
	if (!targetNammers) {
		return {
			success: false,
			reply: `That user doesn't exist!`
		}
	}
	senderNammers = +senderNammers
	targetNammers = +targetNammers
	amount = amount == 'all' ? senderNammers : +amount
	if (senderNammers < amount) {
		return {
			success: false,
			reply: `You can't give away more nammers than you have! You have ${senderNammers} nammers.`
		}
	}
	await utils.setData(`${context.user}Nammers`, senderNammers - amount)
	await utils.setData(`${target}Nammers`, targetNammers + amount)
	return {
		success: false,
		reply: `You gave ${amount} nammers to @${target}. You now have ${senderNammers - amount} nammers, and @${target} has ${targetNammers + amount}.`
	}
}