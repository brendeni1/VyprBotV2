import utils from '../utils'

module.exports = async (client, context) => {
  let id = false
	if (context.args[0] && /^\d+$/.test(context.args[0])) {
		id = true
	}
	const uidCheck = context.args.join(' ').match(/uid(:|=)(true|false)/i)
  if (uidCheck) {
    id = (uidCheck[2] === 'true')
    context.args.splice(context.args.indexOf(uidCheck[0]), 1)
  }
	const chatter = context.args[0]
    ? context.args[0].toLowerCase().replace('@', '')
    : context.user
	try {
		let userData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${chatter}?id=${id}`)
		let creationDate = utils.formatDate(userData.createdAt, "fullDate")
		let timeSinceCreation = utils.formatDelta(creationDate)
		var roles = []
		var uid = userData.banned ? `${userData.id} ⛔` : userData.id
		if (userData.roles.isAffiliate) {
			roles.push('Affiliate')
		}
		if (userData.roles.isPartner) {
			roles.push('Partner')
		}
		if (userData.roles.isStaff) {
			roles.push('Staff')
		}
		if (userData.verifiedBot) {
			roles.push('Verified-Bot')
		}
		if (!userData.roles.isAffiliate && !userData.roles.isPartner && !userData.roles.isStaff && !userData.verifiedBot) {
			roles.push('(No Roles)')
		}
		const bannedUser = userData.banned
		const banReason = userData.banned
      ? userData.banReason
      ? userData.banReason == 'TOS_TEMPORARY' 
      ? `| Ban Reason: @${userData.displayName} is temporarily banned for violating Twitch TOS.` 
      : userData.banReason == 'TOS_INDEFINITE' 
      ? `| Ban Reason: @${userData.displayName} is permanently banned for violating Twitch TOS.` 
      : userData.banReason == 'DEACTIVATED' 
      ? `| Ban Reason: @${userData.displayName} has manually closed their account, they aren't banned.` 
      : userData.banReason == 'DMCA' 
      ? `| Ban Reason: @${userData.displayName}'s channel was closed due to DMCA.` 
      : `| Ban Reason: ${userData.banReason}` 
      : `| Ban Reason: (NONE)` 
      : ``
		let obj = {
			banned: userData.banned,
			followers: userData.followers,
			following: userData.follows,
			name: userData.displayName,
			uid: uid,
			bio: userData.bio,
			colour: userData.chatColor,
			pfp: userData.logo,
			rolesArray: roles,
			roles: roles.join(', '),
			creationDate: creationDate,
			timeSinceCreation: timeSinceCreation,
		}
		return {
			success: true,
			obj,
			reply: `Display Name: @${obj.name} | Banned: ${bannedUser} ${banReason} | UID: ${obj.uid} | Created: ${obj.creationDate} (${obj.timeSinceCreation} ago) | Followers: ${obj.followers} | Colour: ${obj.colour ?? '(No Colour Set)'} | Bio: ${obj.bio ?? '(No Bio Set)'} | Profile Picture: ${obj.pfp} | Roles: ${obj.roles}`
		}
	} catch (err) {
		return {
			success: false,
			reply: `${err} ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
}