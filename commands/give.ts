import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0] || !context.args[1] || !/(^\d+$)|(^all$)/.test(context.args[1])) {
		return {
			success: false,
			reply: `Invalid syntax! Usage: "${context.prefix}give {user} {amount}" ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	let [target, amount] = [context.args[0].toLowerCase().replace('@', ''), context.args[1].toLowerCase()]
	if (target == context.user) {
		return {
			success: false,
			reply: `You cannot give nammers to yourself! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	if (amount == 0) {
		return {
			success: false,
			reply: `You cannot give 0 nammers! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	let [senderNammers, targetNammers] = [await utils.getData(`${context.user}Nammers`), await utils.getData(`${target}Nammers`)]
	if (!senderNammers || +senderNammers == 0) {
		return {
			success: false,
			reply: `You don't have any nammers! Use: "${context.prefix}hunt" to get some. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	if (!targetNammers) {
		return {
			success: false,
			reply: `That user doesn't exist! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	senderNammers = +senderNammers
	targetNammers = +targetNammers
	amount = amount == 'all' ? senderNammers : +amount
	if (senderNammers < amount) {
		return {
			success: false,
			reply: `You can't give away more nammers than you have! You have ${senderNammers} nammers. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	await utils.setData(`${context.user}Nammers`, senderNammers - amount)
	await utils.setData(`${target}Nammers`, targetNammers + amount)
	return {
		success: false,
		reply: `You gave ${amount} nammers to @${target}. You now have ${senderNammers - amount} nammers, and @${target} has ${targetNammers + amount}.`
	}
}