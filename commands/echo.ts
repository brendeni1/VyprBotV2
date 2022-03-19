import utils from '../utils'

module.exports = async (client, context) => {
	if (!await utils.checkAdmin(context.user)) {
		return {
			success: false,
			reply: `You don't have permission to use that command! Use: "${context.prefix}say {message}" instead. Required: Admin`
		}
	}
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Please provide a message to say.`
		}
	}
	const channelCheck = context.args.join(' ').match(/(in|channel)(:|=)(\w+)/i)
	var channel = channelCheck ? channelCheck[3] : context.channel;
	if (channelCheck) {
		context.args.splice(context.args.indexOf(channelCheck[0]), 1)
	}
	const timer = ms => new Promise(res => setTimeout(res, ms))
	if (channel == 'all') {
		const channels = utils.getChannels()
		for (let i = 0; i < channels.length; i++) {
			channel = channels[i]
			client.privmsg(channel, context.args.join(' '))
			await timer(500)
		}
		return
	}
	client.privmsg(channel, context.args.join(' '))
}