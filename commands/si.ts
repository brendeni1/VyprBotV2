import utils from '../utils'

module.exports = async (client, context) => {
	const targetChannel = context.args[0]
    ? context.args[0].toLowerCase().replace('@', '')
    : context.channel
	try {
		const channelData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${targetChannel}`)
		let streamData = await utils.streamDetails(targetChannel)
		if (!streamData.data[0]) {
			lastStream = channelData.lastBroadcast.startedAt
        ? `Last streamed ${utils.formatDelta(channelData.lastBroadcast.startedAt)} ago (${utils.formatDate(channelData.lastBroadcast.startedAt, 'paddedShortDate')})`
        : 'User has never streamed.'
			lastStreamTitle = channelData.lastBroadcast.title
        ? `Title: ${channelData.lastBroadcast.title}`
        : 'User has no set title.'
      const link = `https://www.twitch.tv/${channelData.login}`
			return {
				success: true,
				reply: `${lastStream} | ${lastStreamTitle} | Link: ${link}`
			}
		}
		streamData = streamData.data[0]
		const type = streamData.type == 'live' ? 'streaming' : '(Unknown Stream Method)'
		const game = streamData.game_name ? streamData.game_name : '(No Game Set)'
		const title = streamData.title ? `"${streamData.title}"` : '(No Title Set)'
		const duration = utils.formatDelta(streamData.started_at, -6)
    const link = `https://www.twitch.tv/${streamData.user_login}`
		return {
			success: true,
			reply: `${streamData.user_login} is ${type} ${game} to ${streamData.viewer_count} viewers. Their title is: ${title} and they have been streaming for ${duration}. ${link}`
		}
	} catch (e) {
		return {
			success: false,
			reply: `${e} ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
}