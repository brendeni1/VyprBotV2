import utils from '../utils'
import fs from 'fs-extra'

module.exports = async (client, context) => {
	if (!context.args[0] || !/^\d+$/.test(context.args[0])) {
		return {
			success: false,
			reply: `Please provide a valid suggestion ID to unset.`
		}
	}
	let id = +context.args[0]
	if (!await fs.exists(`suggestions/active/${id}.json`)) {
		return {
			success: false,
			reply: `There is no suggestion with that id!`
		}
	}
	let suggestionDetails = await fs.readJson(`suggestions/active/${id}.json`)
	if (suggestionDetails.user !== context.user && !await utils.checkAdmin(context.user)) {
		return {
			success: false,
			reply: `You don't own that suggestion!`
		}
	}
	await fs.writeJson(`suggestions/active/${id}.json`, {
		user: context.user,
		id: id,
		channel: suggestionDetails.channel,
		date: suggestionDetails.date,
		dateDismissed: utils.addHours(new Date(), -5).toISOString(),
		suggestion: suggestionDetails.suggestion
	})
	await fs.rename(`suggestions/active/${id}.json`, `suggestions/author-dismissed/${id}.json`)
	return {
		success: true,
		reply: `Your suggestion with the ID ${id} was successfully unset.`
	}
}