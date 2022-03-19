import utils from '../utils'

module.exports = async (client, context) => {
	let [user, channel] = [context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user, context.args[1] ? context.args[1].toLowerCase().replace('@', '') : context.channel]
	try {
		const followData = await utils.fetch(`https://api.ivr.fi/twitch/subage/${user}/${channel}`)
		user = followData.username
		channel = followData.channel
		const address = user.toLowerCase() == context.user ? {
			name: `You`,
			verb: 'are'
		} : {
			name: `@${user}`,
			verb: 'is'
		}
		if (!followData.followedAt) {
			return {
				success: true,
				reply: `${address.name} ${address.verb} not following @${channel}.`
			}
		}
		const [followDelta, followDate] = [utils.formatDelta(followData.followedAt), utils.formatDate(followData.followedAt, "fullDate")]
		return {
			success: true,
			reply: `${address.name} followed @${channel} on ${followDate} which was ${followDelta} ago.`
		}
	} catch (e) {
		return {
			success: false,
			reply: e
		}
	}
}