import utils from '../utils'

module.exports = async (client, context) => {
	try {
		const idCheck = context.args.join(' ').match(/(u?id|lookup)(:|=)(true|false)/i)
		const id = idCheck ? Boolean(idCheck[2].toLowerCase()) : false;
		if (idCheck) {
			context.args.splice(context.args.indexOf(idCheck[0]), 1)
		}
		const chatter = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
		const chatterData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${chatter}?id=${id}`)
		return {
			success: true,
			reply: `User: @${chatterData.displayName} | Profile Picture: ${chatterData.logo}`
		}
	} catch (err) {
		return {
			success: false,
			reply: err
		}
	}
}