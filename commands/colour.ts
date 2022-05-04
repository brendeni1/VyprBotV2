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
    const { chatColor, displayName, login } = chatterData
    let colourName = await utils.fetch(`https://www.thecolorapi.com/id?hex=${chatColor.replace('#', '')}`)
    colourName = colourName.name.value ?? ''
    const target = context.user == login
    ? 'Your color is set to:'
    : `@${displayName} set their colour to:`
    return {
			success: true,
			reply: `${target} ${colourName} ${chatColor}`
		}
	} catch (e) {
		return {
			success: false,
			reply: `${e} ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
}