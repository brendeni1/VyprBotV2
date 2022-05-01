import utils from '../utils'
import fs from 'fs-extra'

module.exports = async (client, context) => {
	if (!await utils.checkAdmin(context.user) && context.args[0]) {
    if (context.args[0].toLowerCase().replace('@', '') != context.user) {
  		return {
  			success: false,
  			reply: `Only Admins can leave other people's channels. To remove VyprBot from your channel, use "vb part". Don't include a channel name.`
  		}
    }
	}
	const silentCheck = context.args.join(' ').match(/silent(:|=)(true|false)/i)
	let silent = silentCheck ? Boolean(silentCheck[2]) : false;
	if (silentCheck) {
		context.args.splice(context.args.indexOf(silentCheck[0]), 1)
	}
	let target = context.user
	if (await utils.checkAdmin(context.user) && context.args[0]) {
		target = context.args[0].toLowerCase().replace('@', '')
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
  client.whisper('darkvypr', `Action: Left @${target} using channel: @${context.channel}`)
	return {
		success: true,
		reply: `Successfully left #${target} PoroSad`
	}
}