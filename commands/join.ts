import utils from '../utils'
import fs from 'fs-extra'

module.exports = async (client, context) => {
	if (!await utils.checkAdmin(context.user) && context.args[0]) {
    if (context.args[0].toLowerCase().replace('@', '') != context.user) {
  		return {
  			success: false,
  			reply: `Only Admins can join other people's channels. To add VyprBot to your channel, use "vb join". Don't include a channel name.`
  		}
    }
	}
	const silentCheck = context.args.join(' ').match(/silent(:|=)(true|false)/i)
	let silent = silentCheck ? Boolean(silentCheck[2]) : false;
	if (silentCheck) {
		context.args.splice(context.args.indexOf(silentCheck[0]), 1)
	}
	let channels = await utils.getChannels()
	let target = context.user
	if (await utils.checkAdmin(context.user) && context.args[0]) {
		target = context.args[0].toLowerCase().replace('@', '')
	}
	if (channels.indexOf(target) != -1) {
		return {
			success: false,
			reply: `Channel already joined! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	channels.push(target)
	await fs.writeFile('db/channels.txt', channels.join(' '))
	client.join(target)
	if (!silent) {
		client.me(target, `Successfully Joined ${await utils.bestEmote(target, ['YAAAY', 'Arrive', 'peepoArrive', 'FeelsDankMan', 'FeelsDonkMan', '🙋‍♂️', '😀'])} Prefix: 'vb'`)
	}
  client.whisper('darkvypr', `Action: Joined @${target} using channel: @${context.channel}`)
	return {
		success: true,
		reply: `Successfully joined #${target} TehePelo`
	}
}