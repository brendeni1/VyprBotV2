import utils from '../utils'
import fs from 'fs-extra'

module.exports = async (client, context) => {
	if (context.channel != context.user && !await utils.checkAdmin(context.user)) {
		return {
			success: false,
			reply: `You don't have permission to use that command! Required: Owner or Admin`
		}
	}
	const silentCheck = context.args.join(' ').match(/silent(:|=)(true|false)/i)
	silent = silentCheck ? Boolean(silentCheck[2]) : false;
	if (silentCheck) {
		context.args.splice(context.args.indexOf(silentCheck[0]), 1)
	}
	target = context.channel
	if (await utils.checkAdmin(context.user) && context.args[0]) {
		target = context.args[0].toLowerCase().replace('@', '')
	}
	if (!await utils.checkAdmin(context.user) && context.args[0] && context.args[0].toLowerCase().replace('@', '') != context.channel) {
		return {
			success: false,
			reply: `You don't have permission to leave other people's channels! Required: Admin ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	const channels = await utils.getChannels()
	if (channels.indexOf(target) == -1) {
		return {
			success: false,
			reply: `Channel is not joined! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	channels.splice(channels.indexOf(target), 1)
	await fs.writeFile('db/channels.txt', channels.join(' '))
	client.part(target)
	if (!silent) {
		client.me(target, `Successfully Left PoroSad 👋`)
	}
	return {
		success: true,
		reply: `Successfully left #${target} PoroSad`
	}
}