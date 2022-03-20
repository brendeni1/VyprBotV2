import utils from '../utils'

module.exports = async (client, context) => {
	const targetChannel = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.channel
	try {
		const channelData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${targetChannel}`)
		let streamData = await utils.streamDetails(targetChannel)
		if (!streamData.data[0]) {
			let lastStreamTitle = channelData.lastBroadcast.title ? `Title: ${channelData.lastBroadcast.title}` : '(No Title Set)'
			return {
				success: true,
				reply: `${lastStreamTitle}`
			}
		}
		streamData = streamData.data[0]
		const title = streamData.title ? `${streamData.title}` : '(No Title Set)'
    const link = `https://www.twitch.tv/${streamData.user_login}`
		return {
			success: true,
			reply: `Title: ${title} | ${link}`
		}
	} catch (e) {
		return {
			success: false,
			reply: e
		}
	}
}