import utils from '../utils'

module.exports = async (client, context) => {
	if (!await utils.checkPermitted(context) && !await utils.checkAdmin(context.user)) {
		return {
			success: false,
			reply: `You don't have permission to use that command! Ask the broadcaster to permit you with "${context.prefix}permit add ${context.user}" and try again. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	if (!/^\d+$/.test(context.args[0]) || context.args[0] > 100 || context.args[0] < 1) {
		return {
			success: false,
			reply: `Invalid Syntax! The max clear is 100, and the correct syntax is: "${context.prefix}clear {amount}"! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	for (let i = context.args[0]; i--;) {
		client.privmsg(context.channel, `/clear`)
	}
}