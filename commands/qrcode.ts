import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0] || !/read|create/.test(context.args[0]) || !context.args[1]) {
		return {
			success: false,
			reply: `Invalid Syntax! Example to make a QR code: "${context.prefix}qrcode create {text/data}", Example to read a QR code: "${prefix}qrcode read {text/data}" ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	const action = context.args[0].toLowerCase()
	context.args.shift()
	const content = encodeURIComponent(context.args.join(' '))
	if (action == 'read') {
		const qrData = await utils.fetch(`https://api.qrserver.com/v1/read-qr-code/?fileurl=${content}`)
		return {
			success: qrData[0].symbol[0].data ? true : false,
			reply: qrData[0].symbol[0].data ?? `There was an error reading that code! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	return {
		success: true,
		reply: `https://api.qrserver.com/v1/create-qr-code/?data=${content}`
	}
}