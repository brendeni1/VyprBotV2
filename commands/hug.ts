import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Provide a target.`
		}
	}
	const target = context.args[0].replace('@', '')
	context.args.shift()
	const message = context.args[0] ? context.args.join(' ') : `${await utils.bestEmote(context.channel, ['catKISS', 'KissAWeeb', 'FumoKiss', 'CatAHomie', 'HUGGIES', '🛌', '😴'])} 💗`
	return {
		success: true,
		reply: `${context.display} picks ${target} up off of their feet and squeezes them tight: ${message} `
	}
}