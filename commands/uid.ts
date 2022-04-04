import utils from '../utils'

module.exports = async (client, context) => {
	const uidCheck = context.args.join(' ').match(/uid(:|=)(true|false)/i)
	const id = uidCheck ? Boolean(uidCheck[2].toLowerCase()) : false
	if (uidCheck) {
		context.args.splice(context.args.indexOf(uidCheck[0]), 1)
	}
	const chatter = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
	try {
		const chatterData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${chatter}?id=${id}`)
		const uid = chatterData.banned ? `UID: ${chatterData.id} ⛔` : `UID: ${chatterData.id}`
		const banReason = chatterData.banned
      ? chatterData.banReason
      ? chatterData.banReason == 'TOS_TEMPORARY'
      ? `| Ban Reason: @${chatterData.displayName} is temporarily banned for violating Twitch TOS.`
      : chatterData.banReason == 'TOS_INDEFINITE'
      ? `| Ban Reason: @${chatterData.displayName} is permanently banned for violating Twitch TOS.`
      : chatterData.banReason == 'DEACTIVATED'
      ? `| Ban Reason: @${chatterData.displayName} has manually closed their account, they aren't banned.`
      : chatterData.banReason == 'DMCA'
      ? `| Ban Reason: @${chatterData.displayName}'s channel was closed due to DMCA.`
      : `| Ban Reason: ${chatterData.banReason}`
      : `| Ban Reason: (NONE)`
      : ``
		return {
			success: true,
			reply: `User: @${chatterData.displayName} | ${uid} ${banReason}`
		}
	} catch (e) {
		return {
			success: false,
			reply: `${e} ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
}