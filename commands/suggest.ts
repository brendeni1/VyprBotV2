import utils from '../utils'
import fs from 'fs-extra'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Provide a suggestion for me to read... ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', '😵', '⛔'])}`
		}
	}
	let id = +await utils.getData('suggestion') + 1
	utils.setData('suggestion', id)
	await fs.writeJson(`suggestions/active/${id}.json`, {
		user: context.user,
		id: id,
		channel: context.channel,
		date: new Date().toISOString(),
		suggestion: context.args.join(' ')
	})
	client.whisper('darkvypr', `[New Suggestion] User: ${context.user} | Channel: ${context.channel} | ID: ${id} | Body: ${context.args.join(' ')}`)
	let checkIfAFK = await utils.fetch(`https://supinic.com/api/bot/afk/check?auth_user=${process.env['SUPI_USER_AUTH']}&auth_key=${process.env['SUPI_USERKEY_AUTH']}&userID=1093802`)
	if (checkIfAFK.data.status) {
		await utils.fetchPost(`https://supinic.com/api/bot/reminder?auth_user=${process.env['SUPI_USER_AUTH']}&auth_key=${process.env['SUPI_USERKEY_AUTH']}&userID=1093802&private=true&text=[New Suggestion] A new suggestion has been made while you were AFK: User: ${context.user} | ID: ${id} | Channel: ${context.channel} | Body: ${context.args.join(' ')}`)
	}
	context.user == 'darkvypr' ? null : client.whisper(context.user, `You created a suggestion with the ID: ${id} on ${utils.formatDate(new Date(), "mmmm dS, yyyy, h:MM TT")} (GMT).`)
	return {
		success: true,
		reply: `Your suggestion has been saved. ID: ${id}`
	}
}