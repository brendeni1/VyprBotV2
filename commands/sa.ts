import utils from '../utils'

module.exports = async (client, context) => {
	let [targetUser, targetChannel] = [context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user, context.args[1] ? context.args[1].toLowerCase().replace('@', '') : context.channel]
	try {
		let subDetails = await utils.fetch(`https://api.ivr.fi/twitch/subage/${targetUser}/${targetChannel}`)
		let [hidden, user, channel, subStatus, subType, subTier, giftData, months, streak] = [subDetails.hidden, subDetails.username, subDetails.channel, subDetails.subscribed, subDetails.meta.type, subDetails.meta.tier, subDetails.meta.gift, subDetails.cumulative.months, subDetails.streak.months]
		let remainingOnActiveSub = utils.formatDelta(subDetails.meta.endsAt)
		let timeSinceSubEnded = utils.formatDelta(subDetails.cumulative.end)
		const address = targetUser == context.user ? {
			pronoun: 'You',
			determiner: 'Your',
			name: `You`,
			verb: 'have',
			verb2: 'are',
			idiom: "aren't"
		} : {
			pronoun: 'They',
			determiner: 'Their',
			name: `@${user}`,
			verb: 'has',
			verb2: 'is',
			idiom: "isn't"
		}
		if (hidden) {
			let userData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${targetChannel}`)
			if (!userData.roles.isAffiliate && !userData.roles.isPartner && !userData.roles.isStaff) {
				return {
					success: false,
					reply: `@${channel} is not an affiliate!`
				}
			}
			return {
				success: false,
				reply: `${address.name} ${address.verb} hidden ${address.determiner.toLowerCase()} subscription status!`
			}
		}
		if (months == 0) {
			return {
				success: true,
				reply: `${address.name} ${address.verb} never been subbed to @${channel}.`
			}
		}
		if (!subStatus && months != 0) {
			return {
				success: true,
				reply: `${address.name} ${address.idiom} currently subbed to @${channel}, but ${address.pronoun.toLowerCase()} have previously. ${address.pronoun} were subbed for ${months} month(s) and ${address.determiner.toLowerCase()} sub expired ${timeSinceSubEnded} ago.`
			}
		}
		if (subTier == 'Custom') {
			return {
				success: true,
				reply: `${address.name} ${address.verb2} currently subbed to @${channel} with a permanent sub! ${address.pronoun} have been subbed for ${months} month(s).`
			}
		}
		if (subTier == 3 && !subDetails.meta.endsAt) {
			return {
				success: true,
				reply: `${address.name} ${address.verb2} currently subbed to @${channel} with a permanent sub! ${address.pronoun} have been subbed for ${months} month(s).`
			}
		}
		if (subType == 'paid') {
			return {
				success: true,
				reply: `${address.name} ${address.verb2} currently subbed to @${channel} with a tier ${subTier} paid sub! ${address.pronoun} have been subbed for ${months} month(s) and are on a ${streak} month streak. ${address.determiner} sub expires/renews in ${remainingOnActiveSub}.`
			}
		}
		if (subType == 'prime') {
			return {
				success: true,
				reply: `${address.name} ${address.verb2} currently subbed to @${channel} with a free Twitch Prime sub! ${address.pronoun} have been subbed for ${months} month(s) and are on a ${streak} month streak. ${address.determiner} sub expires/renews in ${remainingOnActiveSub}.`
			}
		}
		if (subType == 'gift') {
			return {
				success: true,
				reply: `${address.name} ${address.verb2} currently subbed to @${channel} with a tier ${subTier} gift sub by @${giftData.name}! ${address.pronoun} have been subbed for ${months} month(s) and are on a ${streak} month streak. ${address.determiner} sub expires/renews in ${remainingOnActiveSub}.`
			}
		}
	} catch (err) {
		return {
			success: false,
			reply: err
		}
	}
}