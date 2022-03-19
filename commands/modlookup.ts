import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Provide a user to lookup!`
		}
	}
	const user = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
	return {
		success: true,
		reply: `Semi-Complete list: https://modlookup.3v.fi/u/${user} MODS`
	}
}