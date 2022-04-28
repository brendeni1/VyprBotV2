import utils from '../utils'
import notify from '../tools/notifier'
import fs from 'fs-extra'

module.exports = async (client, context) => {
	if (!await utils.checkAdmin(context.user)) {
		return {
			success: false,
			reply: `You don't have permission to use that command! Required: Admin ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	const options = ['approved', 'denied']
	if (context.args.length < 2 || !/^\d+$/.test(context.args[0]) || options.indexOf(context.args[1]) == -1) {
		return {
			success: false,
			reply: `Invalid Syntax! Example: "${context.prefix}complete {id} {approved|denied} {optional: reason}" ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	let [id, action, reason] = [+context.args[0], context.args[1].toLowerCase(), context.args.slice(2).join(' ') ? context.args.slice(2).join(' ') : '(No reason provided!)']
	if (!await fs.exists(`suggestions/active/${id}.json`)) {
		return {
			success: false,
			reply: `There is no suggestion with that the ID: ${id}! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	let suggestionDetails = await fs.readJson(`suggestions/active/${id}.json`)
	await fs.writeJson(`suggestions/active/${id}.json`, {
		user: suggestionDetails.user,
		actionBy: context.user,
		id: id,
		channel: suggestionDetails.channel,
		date: suggestionDetails.date,
		dateApproved: new Date().toISOString(),
		state: 'Approved/Finished',
		suggestion: suggestionDetails.suggestion,
		reason: reason
	})
	await fs.rename(`suggestions/active/${id}.json`, `suggestions/${action}/${id}.json`)
	if (suggestionDetails.user != 'darkvypr') {
    await notify.add(suggestionDetails.user, `[SYSTEM - Suggestion Update] Your suggestion with the ID ${suggestionDetails.id} was ${action}! Notes: ${reason}`)
  }
	return {
		success: true,
		reply: `Successfully notified @${suggestionDetails.user} and ${action} suggestion ${suggestionDetails.id}.`
	}
}