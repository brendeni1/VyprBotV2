import utils from '../utils'

module.exports = async (client, context) => {
	const [user, channel] = [context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user, context.args[1] ? context.args[1].toLowerCase().replace('@', '') : context.channel]
	try {
		const logs = await utils.fetch(`https://api.ivr.fi/logs/firstmessage/${channel}/${user}`)
		console.log(logs)
		return {
			success: true,
			reply: `@${user}'s first message in #${channel} was: "${logs.message}" (${logs.time} ago)`
		}
	} catch (e) {
		return {
			success: false,
			reply: e
		}
	}
}