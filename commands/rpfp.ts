import utils from '../utils'

module.exports = async (client, context) => {
	const spoilerCheck = context.args.join(' ').match(/(user)(:|=)(true|false)/i)
	const spoiler = spoilerCheck ? Boolean(spoilerCheck[2].toLowerCase()) : false;
	if (spoilerCheck) {
		context.args.splice(context.args.indexOf(spoilerCheck[0]), 1)
	}
	const chatter = await utils.fetch(`http://decapi.me/twitch/random_user/${context.channel}`, undefined, 'text')
	const chatterData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${chatter}`)
	return {
		success: true,
		reply: spoiler ? `User: @${chatterData.displayName} | Profile Picture: ${chatterData.logo}` : `Profile Picture: ${chatterData.logo}`
	}
}