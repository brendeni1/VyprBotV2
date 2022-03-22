import utils from '../utils'
import isoConv from 'iso-language-converter'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Please provide a phrase or word to translate! Example: https://i.darkvypr.com/translate-example.png ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	const toCheck = context.args.join(' ').match(/to(:|=)([a-zA-Z])+/i)
	const fromCheck = context.args.join(' ').match(/from(:|=)([a-zA-Z])+/i)
	var to = 'en'
	var from = ' '
	if (toCheck && toCheck[0].length > 5) {
		to = isoConv(utils.capitalizeEachWord(toCheck[0].replace(/to(:|=)/i, '')));
		context.args.splice(context.args.indexOf(toCheck[0]), 1)
	}
	if (fromCheck && fromCheck[0].length > 5) {
		from = isoConv(utils.capitalizeEachWord(fromCheck[0].replace(/from(:|=)/i, '')));
		context.args.splice(context.args.indexOf(fromCheck[0]), 1)
	}
	try {
		let translation = await utils.fetch(`https://api-free.deepl.com/v2/translate?auth_key=${process.env['TRANSLATE_KEY']}&text=${encodeURIComponent(context.args.join(' '))}&target_lang=${to}&source_lang=${from}`)
		translation = translation.translations[0]
		to = isoConv(to)
		from = isoConv(translation.detected_source_language.toLowerCase())
		return {
			success: true,
			reply: `(${from} > ${to}) Translation: ${translation.text}`
		}
	} catch (e) {
		return {
			success: true,
			reply: `${e} | The language you provided was probably not valid! Valid Languages: https://i.darkvypr.com/languages.png ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
}